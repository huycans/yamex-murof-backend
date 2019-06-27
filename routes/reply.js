const express = require("express");
const bodyParser = require("body-parser");
// const model = require("../models/");
// const authenticate = require("../authenticate");
const cors = require("./cors");

const replyRouter = express.Router();
replyRouter.use(bodyParser.json());


replyRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,(req, res, next) => {
    let {thrid, page} = req.query;
    console.log("Return a list of reply");
    res.end("Return a list of reply");
  })
  .post(cors.cors,
    (req, res, next) => {
      console.log("Register a thank you");
      res.end("Register a thank you")
    }
  )
  .put(cors.cors,
    (req, res, next) => {
      console.log("Create a new reply");
      res.end("Create a new reply")
    }
  )

module.exports = replyRouter;