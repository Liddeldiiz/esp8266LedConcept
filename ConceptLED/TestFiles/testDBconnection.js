const { MongoClient } = require("mongodb");

async function main() {

    const uri = "mongodb://localhost:27017/test?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LED");
        var myobj = {name: "switchTime", time: new Date()};
        dbo.collection("SwitchLed").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
            db.close()
        })
    });

        /*
    try {
        
        await client.connect();
        await listDatabases(client);

    } catch(e) {
        console.log(e);
    } finally {
        await client.close();
    }
    */
}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);