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

app.get("/", function (request, response) {
    response.sendFile(__dirname + '/static/img/image.png');
    logger.info('GET request');
});

app.post("/", jsonParser, function (req, res) {
    var bookId = req.params.id;
    var bookTitle = req.body.title;
    var bookAuthor = req.body.author;
    var book = { id: bookId, title: bookTitle, author: bookAuthor };
    
    var content = fs.readFileSync("Books.txt", "utf8");
    var books = JSON.parse(content);
    var id = Math.max(...books.map((book) => book.id));

    if (Number.isFinite(id)) {
        book.id = id + 1;
    } else {
        book.id = 1;
    }

    book = { id: id + 1, title: "Fathers and Sons", author: "Ivan Turgenev" };

    books.push(book);

    content = JSON.stringify(books);

    fs.writeFileSync("Books.json", content);
    res.send(books);
});

app.delete("/:id", function (req, res) {
    var bookId = req.params.id;
    var content = fs.readFileSync("Books.txt", "utf8");
    var books = JSON.parse(content);
    var index = bookId -1;
    book = books.splice(index, 1);
    content = JSON.stringify(books);

    fs.writeFileSync("Books.json", content);
    res.send(books);
});

app.put("/:id", jsonParser, function (req, res) {
    var bookId = req.params.id;
    var bookTitle = req.body.title;
    var bookAuthor = req.body.author;
    var content = fs.readFileSync("Books.txt", "utf8");
    var books = JSON.parse(content);
    var book = { id: bookId, title: bookTitle, author: bookAuthor };
    var index = bookId - 1;

    book = books.splice(index, 1);
    book = { id: bookId, title: "The Government Inspector", author: "Nikolai Gogol" }
    book = books.splice(index, 0, book);
    content = JSON.stringify(books);

    fs.writeFileSync("Books.json", content);
    res.send(books);
});

app.options("/", function (req, res) {
    var content = fs.readFileSync("Options.txt", "utf8");
    var options = JSON.parse(content);

    res.send(options);
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
});

