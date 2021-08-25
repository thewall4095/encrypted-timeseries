const db = require("../services/connection");
const redisOperationService = require("../services/redis_operation");
var moment = require("moment");


const dbOperationService = () => {

    const insertToCache = async (data) => {
        const timestamp = moment().startOf('minute');
        const source = timestamp.format();
        const collectionTimestamp = timestamp.toDate();
        console.log(moment(source).toDate());
        const document = {
            ts : collectionTimestamp,
            source: source,
            messagesCount: data.messagesCount,
            corruptedMessagesCount: data.corruptedMessagesCount,
            data: data.decryptedMessages
        }
        let abc = await redisOperationService().save(source, document);
        console.log(abc, 'saved data');
    };

    const saveToTimeseriesDB = async (key, document) => {
        try {
            const collection = db.collection("encrypted-timeseries-collection");
                console.log(document.ts, 'before');
                document.ts = moment(document.ts).toDate();
                console.log(document.ts, 'after');
                let a = await collection.insertOne(document);
                if(a)
                    await redisOperationService().deleteWithKey(key);
        } catch (err) {
            console.log(err);
        }
    }

    const findTimeseriesDocument = async (source) => {
        const document = await db.collection("encrypted-timeseries-collection").findOne({ source: source });
        console.log(document);
        return document;
    }

    const scheduledDbOperation = async () => {
        try {
            let cachedDataKeys = await redisOperationService().getRedisKeys();
            cachedDataKeys.forEach(async element =>  {
                let alreadyExistingData = await redisOperationService().retrieve(element);
                alreadyExistingData = JSON.parse(alreadyExistingData);
                const dataSourceTime = moment(alreadyExistingData.source); //.toDate();
                const currenttimestamp = moment();
                const lastMinuteDate = currenttimestamp.subtract({minute: 1});
                console.log(lastMinuteDate, dataSourceTime);
                if(lastMinuteDate.diff(dataSourceTime) >= 0){
                    await saveToTimeseriesDB(element, alreadyExistingData);
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    return {
        insertToCache,
        saveToTimeseriesDB,
        scheduledDbOperation,
        findTimeseriesDocument
    };
}

module.exports = dbOperationService;