
const { MongoClient } = require('mongodb')
// Connection URL
const url = 'mongodb+srv://thewall:Webking12$@cluster0.6fllb.mongodb.net/encrypted-timeseries-db?retryWrites=true&w=majority'
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })


const dbService = () => {

    const successfulDBStart = () =>
      console.info('connection to the database has been established successfully');
  
    const errorDBStart = (err) =>
      console.info('unable to connect to the database:', err);
  
    const checkIfCollectionExists = async (db, collectionName) => {
      const collections = await db.listCollections().toArray();
      return collections.filter((collection) => collection.name == collectionName)[0];
    }

    const createCollection = async (db, collectionName, collectionAttributes) => {
      const createCollection = await db.createCollection(collectionName, collectionAttributes);
      return createCollection;
    }
  
    const connectDB = async () => {
      try {
        await client.connect()
        console.log('Connected successfully to server')
        const db = client.db("encrypted-timeseries-db")
        const filteredCollection = await checkIfCollectionExists(db, 'encrypted-timeseries-collection');
        if(!filteredCollection){
          createCollection(db, "encrypted-timeseries-collection", {
            timeseries: {
              timeField: "ts",
              metaField: "source",
              granularity: "minutes"
            },
          });
        }
        return successfulDBStart();
        // return collection;
      } catch (err) {
        return errorDBStart(err);
      }
    };

    return {
        connectDB,
        checkIfCollectionExists,
        createCollection
    };
  };
  
  module.exports = dbService;