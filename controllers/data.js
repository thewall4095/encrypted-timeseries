require("dotenv").config();
const db = require("../services/connection");
var moment = require("moment");

module.exports = {
     getTimeseriesData: async (req, res, next) => {
         try{
            const collection = db.collection("encrypted-timeseries-collection");
            const data = await collection.aggregate([
                {"$project": 
                    { 
                        "data":0 //to skip returning the data
                    }
                 },
                 {$sort: {_id: 1}}
              ]).toArray();
            return res.json({
                status: true,
                data: data
            });
         }catch(err){
            return res.status(500).json({
                status: false,
                error: err
            });
         }
    },
    getSpecificTimeData: async (req, res, next) => {
        try{
            const {timestamp} = req.query;
            if(timestamp){
                const collection = db.collection("encrypted-timeseries-collection");
                const data = await collection.aggregate([
                    {$match: { ts: moment(timestamp).toDate() }},
                ]).toArray();
                return res.json({
                    status: true,
                    data: data
                });
            }else{
                return res.json({
                    status: false,
                    data: "pass timestamp"
                })
            }
        }catch(err){
            return res.status(500).json({
                status: false,
                error: err
            });
        }
    }
}