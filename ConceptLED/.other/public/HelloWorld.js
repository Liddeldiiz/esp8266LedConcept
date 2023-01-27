// Simple message display of Hello World on a server with help of the express framework

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World');
})

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
})