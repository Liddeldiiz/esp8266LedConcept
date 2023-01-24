const { parentPort } = require("worker_threads");
const http = require('http');
const { parse } = require('node-html-parser');

const STATUS_QUERY_SELECTOR = '.status'; //.firstChild 

var status;

const statistics = {
    stateOfDevice:0
};

const s1 = statistics;

function getStatus(nodeStatus) {
    status = nodeStatus;
    console.log(status);
    return status;
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

function getDataFromNode() {
    const postData = JSON.stringify({
        'msg': 'Hello World'
    });

    var options ={
        host: '192.168.4.1',
        port: 80,
        path: `/status`,
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
}

getDataFromNode();
getDataFromNode();

parentPort.postMessage(s1.stateOfDevice);