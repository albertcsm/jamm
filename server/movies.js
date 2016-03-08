var path = require('path');
var Datastore = require('nedb');

var db = new Datastore({ filename: path.resolve(__dirname, '../data/movies'), autoload: true });

exports.create = function (req, res, next) {
    var body = req.body;

    db.insert(body, function (err, newDoc) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(newDoc);
        }
    });
};

exports.list = function (req, res, next) {
    db.find({}, function (err, docs) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(docs);
        }
    });
};

exports.show = function (req, res, next) {
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
};

exports.update = function (req, res, next) {
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
};

exports.delete = function (req, res, next) {
    var id = req.params.id;

    db.remove({ _id: id }, {}, function (err, numRemoved) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ numDeleted: numRemoved });
        }
    });
};
