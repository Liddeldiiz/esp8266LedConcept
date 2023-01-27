const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');
const himalaya = require('himalaya');
const { parse } = require('node-html-parser');
const { Worker } = require('worker_threads');

const STATUS_QUERY_SELECTOR = '.status'; //.firstChild 
var status;

const statistics = {
    stateOfDevice:0
};

const s1 = statistics;

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
        
        next();
    });

    app.get('/', async (req, res) => {
        //res.sendFile(__dirname + '/TestPublic/testIndex.html')
        console.log('first app.get');
        //console.log('Before checking status on node: ');
        //console.log(s1.stateOfDevice);
        const worker = new Worker("./testWorker.js");
        worker.on("message", (data) => {
            res.status(200);
            console.log(`result of worker: ${data}`);
        });
        worker.on("error", (msg) => {
            res.status(404).send(`An error has occured: ${msg}`);
        });
        //getDataFromNode('/status');
        //console.log('after checking status on node: ');
        //console.log(`result of getDatatFromNode func: ${getStatus()}`);

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

function getStatus() {
    return s1.stateOfDevice;
}


function getStatusFromNode(nodeStatus) {  
    if (s1.stateOfDevice != nodeStatus) {
      setStatus(nodeStatus);
    }
    return s1.stateOfDevice;
}

function setStatus(update) {
    s1.stateOfDevice = update;
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

            getStatusFromNode(row.rawText);

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
}; // no idea why, but I need to make the request twice in order to get correct data, the first request retrieves old status

  



 