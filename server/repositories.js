var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var Datastore = require('nedb');

var db = new Datastore({ filename: path.resolve(__dirname, '../data/repositories.db'), autoload: true });

router.post('/repositories', function (req, res, next) {
    var body = req.body;

    db.insert(body, function (err, newDoc) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(newDoc);
        }
    });
});

router.get('/repositories', function (req, res, next) {
    db.find({}, function (err, docs) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(docs);
        }
    });
});

router.get('/repositories/:id', function (req, res, next) {
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

router.put('/repositories/:id', function (req, res, next) {
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

router.delete('/repositories/:id', function (req, res, next) {
    var id = req.params.id;

    db.remove({ _id: id }, {}, function (err, numRemoved) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ numDeleted: numRemoved });
        }
    });
});

router.get('/repositories/:id/files', function (req, res, next) {
    var id = req.params.id;
    var dir = req.query.dir;

    db.find({ _id: id }, function (err, docs) {
        if (err) {
            res.status(500).send(err);
        } else if (docs.length == 0) {
            res.status(404).send('Repository not found');
        } else {
            var doc = docs[0];
            var fullpath = dir ? path.resolve(doc.path, dir) : doc.path;
            fs.readdir(fullpath, function (err, files) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var filteredFiles = _.filter(files, function (f) { return f[0] != '.'; });
                    async.map(filteredFiles, function (file, callback) {
                        fs.stat(path.resolve(fullpath, file), function (err, stats) {
                            if (stats.isFile()) {
                                callback(null, {
                                    name: file,
                                    dir: dir ? dir : null,
                                    type: 'file',
                                    ctime: stats.ctime,
                                    mtime: stats.mtime,
                                    size: stats.size
                                });
                            } else if (stats.isDirectory()) {
                                callback(null, {
                                    name: file,
                                    dir: dir ? dir : null,
                                    type: 'directory',
                                    ctime: stats.ctime,
                                    mtime: stats.mtime
                                });
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

module.exports = router;
