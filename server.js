var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    uiDir = __dirname + '/ui',
    path = require('path');
var movies = require('./server/movies.js');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

function startServer(port) {
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.static(uiDir));
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    app.get('/', function (req, res) {
        res.sendFile(uiDir + "/index.html");
    });

    var router = express.Router();

    router.route('/movies')
        .post(function(req, res) {
            movies.create(req.body, function (err, result) {
                res.json(result);
            });
        })
        .get(function(req, res) {
            movies.all(function (err, result) {
                res.json(result);
            });
        });

    router.route('/movies/:id')
        .get(function(req, res) {
            movies.get(req.params.id, function (err, result) {
                res.json(result);
            });
        })
        .put(function(req, res) {
            movies.update(req.params.id, req.body, function (err, result) {
                res.json(result);
            });
        })
        .delete(function (req, res) {
            movies.delete(req.params.id, function (err, result) {
                res.json(result);
            });
        });

    app.use('/api', router);

    app.listen(port, "::");
}

if (argv._.indexOf('export') > -1) {
    console.log('Exporting...');
    movies.all(function (err, result) {
        if (!err) {
            console.log(result);
        }
    });
} else if (argv._.indexOf('import') > -1) {
    fs.readFile('export.json', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        var objArray = JSON.parse(data);
        for (index in objArray) {
            movies.create(objArray[index], function (err, result) {
                if (err) {
                    console.error('Failed to import: ' + err);
                }
            });
        }
    });
} else {
    var port = 3000;
    startServer(port);
    console.log("Jamm server listening at port %s", port);
}
