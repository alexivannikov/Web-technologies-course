const express = require("express");
const fs = require("fs");

const expressLogging = require("express-logging"),
    logger = require("logops");

const app = express();
const jsonParser = express.json();

app.use(expressLogging(logger));

//Раздача
const publicDir = require('path').join(__dirname, '/static');
app.use(express.static(publicDir));
// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/static/html/index.html');
    logger.info('GET request');
});

app.get("/temp/", function (request, response) {
    response.sendFile(__dirname + '/static/temp/welcome.jpg');
    logger.info('GET request');
});

var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
});

