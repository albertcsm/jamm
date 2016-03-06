var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = parseInt(process.env.PORT, 10) || 3000,
    uiDir = __dirname + '/ui',
    path = require('path');
var movies = require('./server/movies.js');

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
        movies.create(req.body, function (result) {
            res.json(result);
        });
    })
    .get(function(req, res) {
        movies.all(function (result) {
            res.json(result);
        });
    });

router.route('/movies/:id')
    .get(function(req, res) {
        movies.get(req.params.id, function (result) {
            res.json(result);
        });
    })
    .put(function(req, res) {
        movies.update(req.params.id, req.body, function (result) {
            res.json(result);
        });
    })
    .delete(function (req, res) {
        movies.delete(req.params.id, function (result) {
            res.json(result);
        });
    });

app.use('/api', router);

app.listen(port, "::");
console.log("Jamm server listening at port %s", port);
