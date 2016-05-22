var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    uiDir = __dirname + '/ui',
    path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var RepoController = require(__dirname + '/server/repos.js');
var MovieController = require(__dirname + '/server/movies.js');
var VolumeController = require(__dirname + '/server/volumes.js');

function startServer(port, datadir) {
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

    var repoController = new RepoController(path.resolve(__dirname, datadir, 'repos.db'));
    app.use('/api', repoController.expressRouter());

    var movieController = new MovieController(path.resolve(__dirname, datadir, 'movies.db'));
    app.use('/api', movieController.expressRouter());

    var volumeController = new VolumeController(path.resolve(__dirname, datadir, 'volumes.db'));
    app.use('/api', volumeController.expressRouter());

    app.listen(port, "::");
}

if (argv.help || argv.h) {
    console.log('Arguments:');
    console.log('  --port=3000');
    console.log('  --datadir=data');
} else {
    var port = argv.port ? argv.port : 3000;
    var datadir = argv.datadir ? argv.datadir : 'data';
    startServer(port, datadir);
    console.log("Jamm server listening at port %s", port);
}
