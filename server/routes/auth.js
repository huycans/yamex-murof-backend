const express = require("express");
const bodyParser = require("body-parser");
// const model = require("../models/");
// const authenticate = require("../authenticate");
// const cors = require("./cors");

const authRouter = express.Router();
authRouter.use(bodyParser.json());


authRouter
  .route("/")
  .post((req, res, next) => {
      console.log("Verify token");
      res.end("Verify token");
    }
  )

module.exports = authRouter;