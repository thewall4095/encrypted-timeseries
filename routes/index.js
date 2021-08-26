const express = require("express");
const indexRouter = express.Router();

const { 
  getTimeseriesData,
  getSpecificTimeData
} = require('../controllers/data')

/* GET home page. */
indexRouter.get("/", function (req, res, next) {
  return res.send({ title: "apis are up" });
});

indexRouter.get("/getTimeseriesData", getTimeseriesData);
indexRouter.get("/getSpecificTimeData", getSpecificTimeData);


const routers = [
  {
    path: "/",
    handler: indexRouter,
  }
];

module.exports = routers;
