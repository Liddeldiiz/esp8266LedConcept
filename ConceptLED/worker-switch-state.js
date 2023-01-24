const { workerData, parentPort } = require("worker_threads");
const http = require('http');
const { parse } = require('node-html-parser');

var result = 1;

function ledFunc(workerData) {
    let url = 'http://192.168.4.1/' + workerData ; // this needs to change, in order to automate this function for n devices, not just one device
    
    let data = '';
    http.get(url, (response) => {
      response.on('data', (chunk) => {
        data += chunk;
      });
  
      response.on('end', () => {
        console.log(data);
      });
    })
    .on('error', (error) => {
      console.log(error);
      result = -1;
    });
    return result;
}

result = ledFunc(workerData);

parentPort.postMessage(result);