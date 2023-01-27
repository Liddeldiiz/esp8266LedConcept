const { workerData, parentPort } = require("worker_threads");
const MongoClient = require('mongodb').MongoClient;

var result = 1;

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

MongoClient.connect(workerData.url, function(err, db) {
    if (err) throw err;

    let insertDate = setQueryTime(workerData.amount);
    var dbo = db.db("LED");
    var myobj = {name: "switchTime", time: insertDate, state: workerData.status/*state signal from clicked button*/};
    dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document updated")
      db.close()
    })
  });

  // I need to add the function for grabbing data from the db

parentPort.postMessage(result);