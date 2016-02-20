var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = parseInt(process.env.PORT, 10) || 3000,
    uiDir = __dirname + '/ui',
    path = require('path');

app.get("/", function (req, res) {
  res.sendFile(uiDir + "/index.html");
});

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

console.log("Jamm server listening at port %s", port);
app.listen(port, "::");
