const express = require("express");
const indexRouter = express.Router();

const { 
    testApi,
} = require('../controllers/data')

/* GET home page. */
indexRouter.get("/", function (req, res, next) {
  return res.send({ title: "apis are up" });
});

indexRouter.get("/test", testApi);

const routers = [
  {
    path: "/",
    handler: indexRouter,
  }
];

module.exports = routers;
