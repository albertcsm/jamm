var express = require('express');

var path = require('path');
var Datastore = require('nedb');

var db;

function MovieController(dbfile) {
    db = new Datastore({ filename: dbfile, autoload: true });
}

MovieController.prototype.expressRouter = function () {
    var router = express.Router();

    router.post('/movies', function (req, res, next) {
        var body = req.body;

        db.insert(body, function (err, newDoc) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(newDoc);
            }
        });
    });

    router.get('/movies', function (req, res, next) {
        db.find({}, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(docs);
            }
        });
    });

    router.get('/movies/:id', function (req, res, next) {
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

    router.put('/movies/:id', function (req, res, next) {
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

    router.delete('/movies/:id', function (req, res, next) {
        var id = req.params.id;

        db.remove({ _id: id }, {}, function (err, numRemoved) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({ numDeleted: numRemoved });
            }
        });
    });

    return router;
};

module.exports = MovieController;
