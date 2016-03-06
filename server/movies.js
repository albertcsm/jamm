var path = require('path');
var Datastore = require('nedb');

var db = new Datastore({ filename: path.resolve(__dirname, '../data/movies'), autoload: true });

exports.create = function (movie, callback) {
    db.insert(movie, function (err, newDoc) {
        callback(err, newDoc);
    });
};

exports.all = function (callback) {
    db.find({}, function (err, docs) {
        callback(null, docs);
    });
};

exports.get = function (id, callback) {
    db.find({ _id: id }, function (err, docs) {
        if (docs) {
            callback(null, docs[0]);
        } else {
            callback('not found', 'not found');
        }
    });
};

exports.update = function (id, movie, callback) {
    db.update({ _id: id }, movie, {}, function (err, numReplaced) {
        if (numReplaced) {
            callback(null, movie);
        } else {
            callback('not found', 'not found');
        }
    });
};

exports.delete = function (id, callback) {
    db.remove({ _id: id }, {}, function (err, numRemoved) {
        callback(null, { numDeleted: numRemoved });
    });
};
