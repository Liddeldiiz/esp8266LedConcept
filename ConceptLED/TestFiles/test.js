const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(express.static('testPublic'));
app.use(bodyParser.text({ extended: false}));

function main() {
    const generatorObject = simpleGenerator();
    console.log(generatorObject.next());
    
};

main();

function readContentOfFile() {
    fs.readFile('testFile.txt', 'utf-8', function (err, contents) {
        console.log(contents);
    });
}

function writeContentTofile() { // appends "content at the end of specified file"
    content = 'This is an examplary log entry\n';

    fs.writeFile('testFile.txt', content, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
    });
}

function* simpleGenerator() {
    yield 1
    yield 2
    yield 3
}