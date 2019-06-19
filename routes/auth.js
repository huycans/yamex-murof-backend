const express = require("express");
const bodyParser = require("body-parser");
// const model = require("../models/");
// const authenticate = require("../authenticate");
// const cors = require("./cors");

const auth = express.Router();
auth.use(bodyParser.json());


auth
  .route("/")
  .post(
    (req, res, next) => {
      console.log("Verify token");
      res.end("Verify token");
    }
  )

module.exports = auth;