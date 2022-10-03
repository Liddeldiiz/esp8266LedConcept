

console.log('Server-side code running');

//const Db = require('mongodb').Db;
const express = require('express');
const {MongoClient} = require('mongodb');
const app = express();
//const assert = require('assert').strict;


// serve files from the public directory
app.use(express.static('public'));


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

  app.post('/LED', (req, res) => {
    MongoClient.connect(uri, function(err, db) {
      if (err) throw err;
      var dbo = db.db("LED");
      var myobj = {name: "switchTime", time: new Date(), state: /*state signal from clicked button*/};
      dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document updated")
          db.close()
      })
    });
  });
};

main().catch(console.error);




// other option
//const url = 'mongodb://localhost:21017/LED'

// only the configuration of the database and the endpoint API of the esp is left + writing the phone app