const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');
const himalaya = require('himalaya');
const { parse } = require('node-html-parser');

const STATUS_QUERY_SELECTOR = '.status'; //.firstChild 
var status;

//const request = require('request');

app.use(express.static('TestPublic'));
app.use(express.json());
//app.use(bodyParser.text({ extended: false}));
//app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({extended: true}));

async function main() {
    
    app.listen(8080, () => {
        console.log('listening on 8080');
    });

    app.use((req, res, next) => {
        console.log('Fetching data from esp');

        //data = ledFunc('status');
        /*console.log('Data from esp fetched');
        console.log(req.path);
        console.log(req.method);
        console.log(req.hostname);
        console.log('data: ');*/
        /*console.log(data);*/
        next();
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/TestPublic/testIndex.html')
        console.log('first app.get');
        getDataFromNode('/status');


        /*console.log('sending Html file');*/
    });

    app.post('/', (req, res) => {
        /*console.log('posting current node status')*/
        newStatus = body.status
        res.send()
    });

};

main().catch(console.error);

function parseHtml(html) {
    return html.bodyParser.urlencoded();
}

async function ledFunc(state) {
    let url = 'http://192.168.4.1/' + state; // this needs to change, in order to automate this function for n devices, not just one device
    let data = await getDataFromNode(state);
    return data;
}; // https://www.w3schools.com/js/js_async.asp

function getStatus(nodeStatus) {
    status = nodeStatus;
    console.log(status);
}

function getDataFromNode(state) {
    const postData = JSON.stringify({
        'msg': 'Hello World'
    });

    var options ={
        host: '192.168.4.1',
        port: 80,
        path: `/${state}`,
        method: 'POST',
        headers: {
            'Content-Type': 'text/html',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var html = '';
    var json = {};
    var req = http.request(options, function (res) {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS" ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
            //console.log(`BODY: ${chunk}`);
            html += chunk;
            const root = parse(html);
            const row = root.querySelector(STATUS_QUERY_SELECTOR).firstChild;
            
            //console.log(typeof row.rawText); //  <-- row.rawText gives me the desired number, but I cannot pass it to the rest of the application

            getStatus(row.rawText);

            //console.log(row.rawText);
        });
        res.on('end', () => {
            console.log('No more data in response');
        });
    });

    req.on('error', (error) => {
      console.log(`Problem with request: ${error}`);
    })
    req.write(postData);
    req.end();
    //console.log('Displaying data: ');
    //console.log(status);
};

  



 