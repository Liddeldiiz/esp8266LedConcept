console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// serve files from the public directory
app.use(express.static('public'));

// connect to the db and start the express server
let db;

const url = 'mongodb://user:password@mongo_address:mongo_port/databaseName';

// other option
// const url = 'mongodb://localhost:21017/databaseName'

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
})

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/switchLED', (req, res) => {
  const switchState = {switchTime: new Date()};
  console.log(switchState);
  console.log(db);

  db.collection('LED').save(swichState, (err, results) => {
    if (err) {
      return console.log(err);
    }
    console.log('action added to db');
    res.sendStatus(201);
  })
})

// only the configuration of the database and the endpoint API of the esp is left + writing the phone app