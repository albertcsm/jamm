var express = require('express'),
    onFinished = require('on-finished');

var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var mediainfo = require("mediainfo-q");
var diskusage = require('diskusage');
var rimraf = require('rimraf');

var Datastore = require('nedb');

var db;

function VolumeController(dbfile) {
    db = new Datastore({ filename: dbfile, autoload: true });
}

VolumeController.prototype.expressRouter = function () {
    var router = express.Router();

    router.post('/volumes', function (req, res, next) {
        var body = req.body;

        db.insert(body, function (err, newDoc) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(newDoc);
            }
        });
    });

    router.get('/volumes', function (req, res, next) {
        db.find({}, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(docs);
            }
        });
    });

    router.get('/volumes/:id', function (req, res, next) {
        var id = req.params.id;

        db.find({ _id: id }, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else if (docs.length == 0) {
                res.status(404).send('Not found');
            } else {
                res.json(docs[0]);
            }
        });
    });

    router.put('/volumes/:id', function (req, res, next) {
        var id = req.params.id;
        var body = req.body;

        db.update({ _id: id }, body, {}, function (err, numReplaced) {
            if (err) {
                res.status(500).send(err);
            } else if (numReplaced == 0) {
                res.status(404).send('Not found');
            } else {
                res.json(body);
            }
        });
    });

    router.delete('/volumes/:id', function (req, res, next) {
        var id = req.params.id;

        db.remove({ _id: id }, {}, function (err, numRemoved) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({ numDeleted: numRemoved });
            }
        });
    });

    router.get('/volumes/:id/diskusage', function (req, res, next) {
        var id = req.params.id;

        db.find({ _id: id }, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else if (docs.length == 0) {
                res.status(404).send('Not found');
            } else {
                var volume = docs[0];
                diskusage.check(volume.path, function (err, info) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.json(info);
                    }
                });
            }
        });
    });

    router.get('/volumes/:id/files', function (req, res, next) {
        var id = req.params.id;
        var dir = req.query.dir;

        db.find({ _id: id }, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else if (docs.length == 0) {
                res.status(404).send('Volume not found');
            } else {
                var volume = docs[0];
                var dirDiskPath = dir ? path.resolve(volume.path, dir) : volume.path;
                fs.readdir(dirDiskPath, function (err, files) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        var filteredFiles = _.filter(files, function (f) { return f[0] != '.'; });
                        async.map(filteredFiles, function (file, callback) {
                            var fullDiskPath = path.resolve(dirDiskPath, file);
                            var pathUnderVolume = dir ? dir + '/' + file : file;
                            fs.stat(fullDiskPath, function (err, stats) {
                                var fileInfo = {
                                    path: pathUnderVolume,
                                    name: file,
                                    ctime: stats.ctime,
                                    mtime: stats.mtime,
                                };

                                if (stats.isFile()) {
                                    fileInfo.type = 'file';
                                    fileInfo.size = stats.size;
                                    callback(null, fileInfo);
                                } else if (stats.isDirectory()) {
                                    fileInfo.type = 'directory';
                                    callback(null, fileInfo);
                                } else {
                                    callback(null, null);
                                }
                            });
                        }, function (err, results) {
                            res.json(results);
                        });
                    }
                });
            }
        });
    });

    router.get('/volumes/:id/files/:file', function (req, res, next) {
        var id = req.params.id;
        var file = req.params.file;
        var range = req.headers.range;

        db.find({ _id: id }, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else if (docs.length == 0) {
                res.status(404).send('Volume not found');
            } else {
                var doc = docs[0];
                var path = doc.path + '/' + file;
                fs.stat(path, function (err, stats) {
                    if (err) {
                        res.status(404).send('File not found');
                    } else {
                        var total = stats.size;
                        var start = 0;
                        var end = total - 1;

                        if (range) {
                            var matches = range.match(/(.*)=(\d*)-(\d*)/);
                            var explicitStart = parseInt(matches[2], 10);
                            var explicitEnd = parseInt(matches[3], 10);
                            if (!isNaN(explicitStart)) {
                                start = explicitStart;
                            }
                            if (!isNaN(explicitEnd)) {
                                end = explicitEnd;
                            }
                        }
                        var chunkSize = end - start + 1;

                        if (chunkSize) {
                            var contentType = '';
                            if (file.match(/\.jpg$/)) {
                                contentType = 'image/jpeg';
                            } else if (file.match(/\.mp4$/)) {
                                contentType = 'video/mp4';
                            }

                            res.writeHead(206, {
                                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                                'Accept-Ranges': 'bytes',
                                'Content-Length': chunkSize,
                                'Content-Type': contentType
                            });

                            var option = { start: start };
                            if (end) {
                                option.end = end;
                            }
                            var stream = fs.createReadStream(path, option)
                            .on('open', function() {
                                stream.pipe(res);
                            })
                            .on('error', function (err) {
                                res.end(JSON.stringify(err));
                                console.error(err);
                            });

                            onFinished(req, function (err, req) {
                                stream.destroy();
                            });
                        } else {
                            res.writeHead(200, { 'Content-Length': 0 });
                            res.end();
                        }
                    }
                });
            }
        });
    });

    router.delete('/volumes/:id/files/:file', function (req, res, next) {
        var id = req.params.id;
        var file = req.params.file;

        db.find({ _id: id }, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else if (docs.length == 0) {
                res.status(404).send('Volume not found');
            } else {
                var doc = docs[0];
                var path = doc.path + '/' + file;

                fs.stat(path, function (err, stats) {
                    if (err) {
                        if (err.code == 'ENOENT') {
                            res.json({ numDeleted: 0 });
                        } else {
                            res.status(500).send(err);
                        }
                    } else {
                        rimraf(path, { disableGlob: true }, function (err) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                console.log('Deleted ' + path);
                                res.json({ numDeleted: 1 });
                            }
                        });
                    }
                });
            }
        });
    });

    router.get('/volumes/:id/files/:file/mediainfo', function (req, res, next) {
        var id = req.params.id;
        var file = req.params.file;
        var ifModifiedSince = req.headers['if-modified-since'];

        db.find({ _id: id }, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else if (docs.length == 0) {
                res.status(404).send('Volume not found');
            } else {
                var doc = docs[0];
                var path = doc.path + '/' + file;

                fs.stat(path, function (err, stats) {
                    if (err) {
                        res.status(404).send('File not found');
                    } else {
                        if (ifModifiedSince && new Date(ifModifiedSince).getTime() == stats.mtime.getTime()) {
                            res.status(304).send('Not Modified');
                        } else {
                            mediainfo(path).then(function (info) {
                                res.setHeader('Last-Modified', stats.mtime.toUTCString());
                                res.json(info[0]);
                            }).catch(function (err) {
                                res.status(500).send(err);
                            });
                        }
                    }
                });
            }
        });
    });

    return router;
};

module.exports = VolumeController;
