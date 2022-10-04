/* the state of the led will be stored inside an object. Once there will be more devices this can be helpful */
const statistics = {
  stateOdDevice:0
}

console.log('Server-side code running');

const express = require('express');
const {MongoClient} = require('mongodb');
const app = express();
const bodyParser = require('body-parser');
const s1 = statistics;


// serve files from the public directory
app.use(express.static('public'));
app.use(bodyParser.text({ extended: false}));


async function main() {
  const uri = "mongodb://localhost:27017/test?retryWrites=true&w=majority";

  const client = new MongoClient(uri)
  
  try {
    await client.connect();
    await startApp(uri);
  } catch(e) {
    console.log(e);
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
    if(getState() == 1) {
      return console.log('LED is already ON!')
    } else {
      console.log('turn On');
      setState(1);
      MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LED");
        var myobj = {name: "switchTime", time: new Date(), state: getState()/*state signal from clicked button*/};
        dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
            db.close()
        })
      });
    }
  });

  app.post("/turnOff", (req, res) => {
    if(getState() == 0) {
      return console.log('LED is already OFF!');
    } else {
      console.log('turn off');
      setState(0);
      MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LED");
        var myobj = {name: "switchTime", time: new Date(), state: getState()/*state signal from clicked button*/};
        dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
            db.close()
        })
      });
    }
  });
};

/* getter and setter need to be modified as soon as the esp API is written*/

function getState() {
  return s1.stateOdDevice;
}

function setState(update) {
  return s1.stateOdDevice = update;
}

main().catch(console.error);



// only the configuration of the endpoint API of the esp is left + writing the phone app