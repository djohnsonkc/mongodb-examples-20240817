/*

Tips:

In MongoDB admin panel, click on "Network Access" and Make sure and "allow access everywhere"

Dev Resource on Connection Pool and monitoring
https://www.mongodb.com/docs/drivers/node/current/fundamentals/monitoring/connection-monitoring/

*/


const { MongoClient } = require("mongodb");
const config = require("./config.json")
const client = new MongoClient(config.connectionString);
var database = null;
var isConnected = false;

client.on('connectionReady', (event) => {
  isConnected = true;
  console.log("connectionReady")
});
client.on('connectionPoolReady', (event) => {
  isConnected = true;
  console.log("connectionPoolReady");
});
client.on('connectionClosed', (event) => {
  isConnected = false;
  console.log("connectionClosed");
});


async function init(callback) {
  try {
    // Establish and verify connection
    database = await client.db(config.dbName);
    database.command({ ping: 1 })
    console.log("MongoDB connection successful!");
    callback({ ok: true, message: "connected to database" });
  } 
  catch(err) {

    console.log("db connection error", err);
    callback({ ok: false, error: err });

  }
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   await client.close();
  //   callback({ ok: false, message: "*** DISCONNECTED FROM DATABASE ***" });
  // }
}

function getDatabase() {
  return database;
}

function getClient() {
  return client;
}


module.exports = {
  init,
  getDatabase,
  getClient,
  isConnected
}