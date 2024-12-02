var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5050
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./instrumented"));

const { viewBlogs } = require('./utils/BrandenUtil')
app.get('/view-blog', viewBlogs);

const { editResource } = require('./utils/JustinUtil')
app.put('/edit-resource/:id', editResource);

const { deleteResource } = require('./utils/ShianUtil')
app.delete('/delete-resource/:id', deleteResource);

const { addResource } = require('./utils/AlsenUtil')
app.post('/add-resource', addResource);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/instrumented/" + startPage);
})

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server }