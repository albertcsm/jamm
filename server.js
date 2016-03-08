var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    uiDir = __dirname + '/ui',
    path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

function createRestResource(resourceName, controllerFile) {
    var restApi = express();
    var controller = require(controllerFile);
    var requestMethod;
    var requestPath;
    var requestHandler;
    for (var key in controller) {
        switch (key) {
            case 'create':
                requestMethod = 'post';
                requestPath = '/' + resourceName;
                break;
            case 'list':
                requestMethod = 'get';
                requestPath = '/' + resourceName;
                break;
            case 'show':
                requestMethod = 'get';
                requestPath = '/' + resourceName + '/:id';
                break;
            case 'update':
                requestMethod = 'put';
                requestPath = '/' + resourceName + '/:id';
                break;
            case 'delete':
                requestMethod = 'delete';
                requestPath = '/' + resourceName + '/:id';
                break;
            default:
                throw new Error('unrecognized route: ' + key);
        }

        requestHandler = controller[key];
        restApi[requestMethod](requestPath, requestHandler);
        console.log('    %s %s -> %s:%s', requestMethod.toUpperCase(), requestPath, controllerFile, key);
    }
    return restApi;
}

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

    app.use('/api', createRestResource('movies', './server/movies.js'));

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
