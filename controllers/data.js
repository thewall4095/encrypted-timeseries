require("dotenv").config();
const db = require("../services/connection");

module.exports = {
     getTimeseriesData: async (req, res, next) => {
        const collection = db.collection("encrypted-timeseries-collection");
        const data = await collection.find({}, {})
        .sort({ ts: 1 })
        .toArray();
        // .then(items => {
        //   console.log(`Successfully found ${items.length} documents.`)
        //   items.forEach(console.log)
        //   return items
        // })
        // .catch(err => console.error(`Failed to find documents: ${err}`))

        return res.json({
            status: true,
            data: data})
    }
}