const express = require("express");
const bodyParser = require("body-parser");
// const model = require("../models/");
// const authenticate = require("../authenticate");
// const cors = require("./cors");

const threadRouter = express.Router();
threadRouter.use(bodyParser.json());


threadRouter
  .route("/")
  .get((req, res, next) => {
    let { sfid, page} = req.query;
    console.log("Return a list of threads");
    res.end("Return a list of threads")
  })
  .put(
    (req, res, next) => {
      console.log("Create a new thread");
      res.end("Create a new thread")
    }
  );
  
threadRouter
  .route("/latest")
  .get((req, res, next) => {
    console.log("Return the newest thread list");
    res.end("Return the newest thread list")
  })

threadRouter
  .route("/:threadId")
  .get((req, res, next) => {
    console.log("Return data for a thread");
    res.end("Return data for a thread")
  })


module.exports = threadRouter;