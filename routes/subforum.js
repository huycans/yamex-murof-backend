const express = require("express");
const bodyParser = require("body-parser");
// const model = require("../models/");
// const authenticate = require("../authenticate");
// const cors = require("./cors");

const subforumRouter = express.Router();
subforumRouter.use(bodyParser.json());


subforumRouter
  .route("/")
  .get((req, res, next) => {
    let {fid} = req.query;
    console.log("Return a list of subforum");
    res.end("Return a list of subforum")
  })
  .put(
    (req, res, next) => {
      console.log("Create a new subforum");
      res.end("Create a new subforum")
    }
  )

module.exports = subforumRouter;