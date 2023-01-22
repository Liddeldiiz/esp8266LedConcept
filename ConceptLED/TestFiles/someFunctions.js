function readContentOfFile() {
    fs.readFile('testFile.txt', 'utf-8', function (err, contents) {
        console.log(contents);
    });
};

function writeContentTofile() { // appends "content at the end of specified file"
    content = 'This is an examplary log entry\n';

    fs.writeFile('testFile.txt', content, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
    });
};

function* simpleGenerator() {
    yield 1
    yield 2
    yield 3
};

 /*const generatorObject = simpleGenerator();
    console.log(generatorObject.next());*/