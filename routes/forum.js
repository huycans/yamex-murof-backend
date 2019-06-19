const express = require("express");
const bodyParser = require("body-parser");
// const model = require("../models/");
// const authenticate = require("../authenticate");
// const cors = require("./cors");

const forum = express.Router();
forum.use(bodyParser.json());

forum
.route("/")
.put((req, res, next) => {
  console.log("Create a new forum");
  res.end("Create a new forum");
});

forum
.route("/all")
.get((req, res, next) => {
  console.log("Returning all forums");
  res.end("Returning all forums");
});

module.exports = forum;
