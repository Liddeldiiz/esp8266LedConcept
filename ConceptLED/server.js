// init function is necessary to establish connection between server and esp

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

/* code identifies from which button the POST method is sent and it updates the database according to these values */

  app.post("/turnOn", (req, res) => {
    if(getStatus() == 1) {
      res.send(console.log('LED is already ON!'));
      return console.log('LED is already ON!');
    } else {
      console.log('turn On');
      setStatus(1);
      ledFunc('led/1');
      MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        const date = new Date();

        let minute = date.getMinutes();
        let hour = date.getHours();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let insertDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
        var dbo = db.db("LED");
        var myobj = {name: "switchTime", time: insertDate, state: getStatus()/*state signal from clicked button*/};
        dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
            db.close()
        })
      });
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
      const date = new Date();

      let minute = date.getMinutes();
      let hour = date.getHours();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let insertDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
      MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LED");
        var myobj = {name: "switchTime", time: insertDate, state: getStatus()/*state signal from clicked button*/};
        dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
            db.close()
        })
      });
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

    const date = new Date();

    let minute = date.getMinutes();
    let hourOne = date.getHours() - 4;
    let hourTwo = date.getHours();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let queryDateOne = `${year}-${month}-${day}T${hourOne}:${minute}:00.000Z`;
    let queryDateTwo = `${year}-${month}-${day}T${hourTwo}:${minute}:00.000Z`;

    console.log(queryDateOne);
    console.log(queryDateTwo);

    MongoClient.connect(uri, function(err, db) { /* {time: 2023-01-19T11:58} is it possible that there is something like "%" needed to ignore minutes and seconds? Anyway, first attempt did not return any data*/
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

/* getter and setter need to be modified as soon as the esp API is written*/

function getStatus() {
  return s1.stateOdDevice;
}

function setStatus(update) {
  return s1.stateOdDevice = update;
}

function ledFunc(state) {
  let url = 'http://192.168.4.1/' + state; /* hide IP adr when uploading to git!!!!*/
  http.get(url, (response) => {
    let data = '';
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
}

main().catch(console.error);



// only the configuration of the endpoint API of the esp is left | DONE
/////////////////////////////////////////////////////////////////////////////////////////////////
// 18.01.2023 - ESP8266 serves a simple website which allows to send requests from node js server 
//              in order to activate the scripts on board of the ESP8266 module


