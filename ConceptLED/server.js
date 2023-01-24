// Check out: https://axios-http.com/docs/intro

/* the state of the led will be stored inside an object. Once there will be more devices this can be helpful */
const statistics = {
  stateOfDevice:0
}

console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const bodyParser = require('body-parser');
const s1 = statistics;
const http = require('http');
const { parse } = require('node-html-parser');
const { Worker } = require('worker_threads');
//const { convert } = require('html-to-exit');
//const { response } = require('express');

const uri = "mongodb://localhost:27017";

const STATUS_QUERY_SELECTOR = '.status'; //.firstChild 

// serve files from the public directory
app.use(express.static('public'));
app.use(bodyParser.text({ extended: false}));


async function main() {
  //const uri = "mongodb://localhost:27017/test?retryWrites=true&w=majority";
  const uri = "mongodb://localhost:27017";
  const client = await new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("connected to client");
    await startApp(uri);
    // I will check status of nodes from linux server via a bash file an return the status here
  } catch(e) {
    console.log(e);
    console.error('Failed to connect to MongoDB Server');
  } finally {
    await client.close();
  }
};

async function startApp(uri) {
  app.listen(8080, () => {
    console.log('listening on 8080');
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  //checkConnectionToNode();
/* code identifies from which button the POST method is sent and it updates the database according to these values */

  app.post("/turnOn", async (req, res) => {
    if(getStatus() == 1) {
      res.send('LED is already ON!');
      return console.log('LED is already ON!');
    } else {
      console.log('turn On');
      //setStatus(1);
      // this tasks gets its own thread
      await ledWorkerFunctions("led/1", res);
      //console.log('checking status after worker(turnOn) node: ')
      //getDataFromNode()
      //console.log(getStatus());
      await updateDB(res, 0);
    }
  });

  app.post("/turnOff", async (req, res) => {
    if(getStatus() == 0) {
      res.send('LED is already OFF!');
      return console.log('LED is already OFF!');
    } else {
      console.log('turn off');
      //setStatus(0);
      // this tasks gets its own thread
      await ledWorkerFunctions("led/0", res);
      //console.log('checking status after worker(turnOff) node: ')
      //getDataFromNode()
      //console.log(getStatus());
      await updateDB(res, 0);
    }
  });

  app.post("/status", async (req, res) => {
    insideGet(res)
      .then((data) => console.log(data))
      .catch((reason) => console.log(`Message: ${reason}`));
  });

/*

logs for activating buttons (turnOff and status)

turn off <---- initiating turnOff(sending request to esp to /led/0 in order to activate the function for turning off led)
<!DOCTYPE HTML>
<html>
LED is now off</html> <---- the html body is the response from esp

1 document updated
LED is ON! <---- no idea why it rushes, it should wait for the getDataFromNode function to grab data from the node, instead this instantly skips the function and grabs old value from s1.statistics
undefined <---- not important right now
STATUS: 200 <---- this is the firts log entry from the getDataFromNode function
HEADERS" {"content-type":"text/html"}
inside getDataFromNode func:
0
No more data in response <---- this is the last log entry from the getDataFromNode function
*/


  app.post("/fourHours", (req, res) => {

    let queryDateOne = setQueryTime(4);
    let queryDateTwo = setQueryTime();
    
    MongoClient.connect(uri, function(err, db) {
      if (err) throw err; // tested on db: {"time": { $gte: "2023-1-19T20:0:00.000Z", $lt: "2023-1-19T20:3:00.000Z"}}
      var dbo = db.db("LED");
      dbo.collection("SwitchLed").find( {time: { $gt: queryDateOne, $lt: queryDateTwo }} ).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          data = result;
          db.close();
      })
    });
    console.log(data);
    if(data != null) {
      res.send(data);
      return console.log('Fetched data for last 4 hours');
    } else {
      res.send(data);
      return console.log('Error while trying to fetch data for last 4 hours')
    }
  })

};

/* getter url part needs to be modified*/

function getStatusFromNode(nodeStatus) {
  //console.log("length of nodeStatus: ", nodeStatus.length);
  //console.log(typeof(nodeStatus));
  var status = Number(nodeStatus);
  //console.log(typeof(status));

  if (s1.stateOfDevice != status) {
    setStatus(status);
    //console.log("if nodestatus is not equal to s1: ", s1);
    return s1.stateOfDevice;
  } else {
    //console.log("if nodestatus was equal to s1: ", s1);
    return s1.stateOfDevice;
  }
}

function getStatus() {
  return s1.stateOfDevice;
}

async function insideGet(res) { // I need a better name for this function
  console.log('before await getDataFromNode()');
  let response = await getDataFromNode();
  console.log('after await getDataFromNode');
  console.log(`response: ${response}`);
  let data;
  var stat;
  if (response == 1) {
    stat = getStatus();
    if (stat == 0 || stat == 1) {
      res.sendStatus(200);
      data = s1;
      return data
    } else if (err) {
      throw err;
    }
  } else {
    console.log('something went wrong with getDataFromNode');
  }
}

function setStatus(update) {
  s1.stateOfDevice = update;
}

async function getDataFromNode() {
  const postData = JSON.stringify({
    'msg': 'Hello World'
  });

  var options ={
    host: '192.168.4.1',
    port: 80,
    path: '/status',
    method: 'POST',
    headers: {
        'Content-Type': 'text/html',
        'Content-Length': Buffer.byteLength(postData)
    }
  };

  var html = '';
  var req = await http.request(options, function (res) {
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

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Multi threading methods ///////////////////////////////////////

function updateDB(res, amountToBeDeducted) {
  const worker = new Worker("./worker-update-db.js", {
    workerData: {status: getStatus(), url: uri, amount: amountToBeDeducted}
  });
  worker.on('message', (data) => {
    res.status(200);
    //console.log(data);
  });
  worker.on('error', (msg) => {
    res.status(404);
    console.log(`An error has occured in worker-update-db.js: ${msg}`);
  });
}

function ledWorkerFunctions(state, res) {
  const worker = new Worker("./worker-switch-state.js", {
    workerData: state
  });
  worker.on('message', (data) => {
    res.status(200);
    //console.log(data);
  });
  worker.on('error', (msg) => {
    res.status(404);
    console.log(`An error has occured in worker-switch-state.js: ${msg}`);
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Casting main function ///////////////////////////////////////////

main().catch(console.error);


// only the configuration of the endpoint API of the esp is left | DONE
/////////////////////////////////////////////////////////////////////////////////////////////////
// 18.01.2023 - ESP8266 serves a simple website which allows to send requests from node js server 
//              in order to activate the scripts on board of the ESP8266 module


