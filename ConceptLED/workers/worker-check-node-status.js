const { parentPort } = require("worker_threads");
const http = require('http');
const { parse } = require('node-html-parser');

const STATUS_QUERY_SELECTOR = '.status'; //.firstChild 

var result;

function getStatusFromNode(nodeStatus) {
    result = Number(nodeStatus);
    return result;
}

function getDataFromNode() {
    const postData = JSON.stringify({
      'msg': 'Hello World'
    });
  
    var options ={
      host: '192.168.4.1', // only one node at the moment
      port: 80,
      path: '/status',
      method: 'POST',
      headers: {
          'Content-Type': 'text/html',
          'Content-Length': Buffer.byteLength(postData)
      }
    };
  
    var html = '';
    var req = http.request(options, function (res) {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS" ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf-8');
      res.on('data', (chunk) => {
        html += chunk;
        const root = parse(html);
        const row = root.querySelector(STATUS_QUERY_SELECTOR).firstChild; 
        //console.log('inside getDataFromNode func: ');
        //console.log(row.rawText);
        getStatusFromNode(row.rawText); // <-- this contains the status received from the node
        //console.log('The data was written to s1.statistics');
        //console.log(getStatus());
      });
      res.on('end', () => {
        console.log('No more data in response');
      });
    });
    req.on('error', (error) => {
      console.log(`Problem with request: ${error}`);
    })
      //req.write(postData);
    req.end();
    return 1;
}

console.log("inside worker-check-node-status.js");
console.log(`result of getting status is: ${result}`);
parentPort.postMessage(result);