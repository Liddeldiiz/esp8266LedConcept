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
const { response } = require('express');

const uri = "mongodb://localhost:27017";

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

  app.post("/turnOn", (req, res) => {
    if(getStatus() == 1) {
      res.send(console.log('LED is already ON!'));
      return console.log('LED is already ON!');
    } else {
      console.log('turn On');
      setStatus(1);
      ledFunc('led/1');
      updateDB();
    }
  });

  app.post("/turnOff", (req, res) => {
    if(getStatus() == 0) {
      res.send(console.log('LED is already OFF!'));
      return console.log('LED is already OFF!');
    } else {
      console.log('turn off');
      setStatus(0);
      ledFunc('led/0');
      updateDB();
    }
  });

  app.post("/status", (req, res) => {
    var data = {status:getStatus()};
    if(getStatus() == 0) {
      res.send(data);
      return console.log('LED is OFF!');
    } else {
        res.send(data);
        return console.log('LED is ON!');
    }
  });


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

function getStatus() {
  let url = 'http://192.168.4.1/status';
  data = getDataFromNode(url, 0);
  console.log(data);
  if (s1.stateOfDevice != data) {
    data = setStatus(data);
  }
  return s1.stateOfDevice;
}

function setStatus(update) {
  return s1.stateOfDevice = update;
}

function ledFunc(state) {
  let url = 'http://192.168.4.1/' + state; // this needs to change, in order to automate this function for n devices, not just one device
  getDataFromNode(url, 1);
}

function setQueryTime(amountToBeDeducted) {
  const date = new Date();

  let minute = date.getMinutes();
  let hourOne = date.getHours() - amountToBeDeducted;
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let queryDate = `${year}-${month}-${day}T${hourOne}:${minute}:00.000Z`;

  return queryDate;
}

function updateDB() {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;

    let insertDate = setQueryTime();
    var dbo = db.db("LED");
    var myobj = {name: "switchTime", time: insertDate, state: getStatus()/*state signal from clicked button*/};
    dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document updated")
      db.close()
    })
  });
}

function getDataFromNode(url, byte) {
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
  });
  if (byte == 0) {
    return data;
  }
}

main().catch(console.error);


// only the configuration of the endpoint API of the esp is left | DONE
/////////////////////////////////////////////////////////////////////////////////////////////////
// 18.01.2023 - ESP8266 serves a simple website which allows to send requests from node js server 
//              in order to activate the scripts on board of the ESP8266 module


