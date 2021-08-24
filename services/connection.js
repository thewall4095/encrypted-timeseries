const { MongoClient } = require('mongodb')
// Connection URL
const url = 'mongodb+srv://thewall:Webking12$@cluster0.6fllb.mongodb.net/encrypted-timeseries-db?retryWrites=true&w=majority'
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
const dotenv = require("dotenv");

dotenv.config();

client.connect((err, connection) => {
  if (err) {
    console.info('unable to connect to the database:', err);
  }
//   if (connection) connection.release();
  return;
});

const db = client.db("encrypted-timeseries-db")

module.exports = db;
