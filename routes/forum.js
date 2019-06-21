const express = require("express");
const bodyParser = require("body-parser");
// const model = require("../models/");
// const authenticate = require("../authenticate");
// const cors = require("./cors");

const forumRouter = express.Router();
forumRouter.use(bodyParser.json());

forumRouter
.route("/")
.put((req, res, next) => {
  console.log("Create a new forum");
  res.end("Create a new forum");
});

forumRouter
.route("/all")
.get((req, res, next) => {
  console.log("Returning all forums");
  res.end("Returning all forums");
});

module.exports = forumRouter;
