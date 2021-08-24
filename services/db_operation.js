const db = require("../services/connection");
const dbService = require("../services/db");
const redisOperationService = require("../services/redis_operation");


const dbOperationService = () => {

    const insertToDB = async (data) => {
        const collection = db.collection("encrypted-timeseries-collection");
        const timestamp = new Date();
        const source = timestamp.toISOString().split(":").slice(0,-1).join(":");
        const collectionTimestamp = new Date(source);
        const document = {
            ts : collectionTimestamp,
            source: source,
            data: data
        }
        // if(dbService().checkIfCollectionExists(db, source)){
        //     const eachMinuteCollection = db.collection(source);
        //     await eachMinuteCollection.insertOne(document);
        // }else{
        //     dbService().createCollection(db, source, {
        //         timeseries: {
        //             timeField: "ts",
        //             metaField: "source",
        //             granularity: "seconds"
        //         },
        //     });
        // }
        // console.log(collectionTimestamp)
        // let a = await collection.updateOne(
        //     { ts : collectionTimestamp, source: source },
        //     {
        //         $push: { data: document.data },
        //     }, 
        //     { upsert: true } );
        // console.log(a, 'inserted');
        // let checkIfExists = await collection.findOne({ "ts": collectionTimestamp });//.toArray();
        // console.log(checkIfExists);
        // if(checkIfExists){
        //     // checkIfExists.data = [...checkIfExists.data, ...data];
        //     let a = await collection.updateOne({ ts : collectionTimestamp }, {$push:{data: data}});
        //     console.log(a, 'updated');
        // }else{
        //     let a = await collection.insertOne(document);// .findOneAndUpdate({ "source": source }, {$set:{data: checkIfExists.data}});
        //     console.log(a, 'inserted');
        // }
    };

    return {
        insertToDB,
    };
}

module.exports = dbOperationService;