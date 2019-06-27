const express = require("express");
const bodyParser = require("body-parser");
const Forums = require("../models/forum");
const cors = require("./cors");

// const authenticate = require("../authenticate");

const forumRouter = express.Router();
forumRouter.use(bodyParser.json());

forumRouter
.route("/")
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
})
.put(cors.cors, (req, res, next) => {
  // TODO: implement admin auth check here
  Forums.create({
    name: req.body.name,
    coverUrl: req.body.coverUrl,
    bikeInfo: req.body.bikeInfo,
    path: String(req.body.name).replace(/ /g,'').toLowerCase(),
    moderators: req.body.moderators ? req.body.moderators : null 
  })
  .then(forum => {
    console.log("Forum created: ", forum.name);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(forum);
  },
  err => {
    next(err);
  })
  .catch(err => {
    next(err);
  });
});

forumRouter
.route("/all")
.options(cors.cors, (req, res) => {
  res.sendStatus(200);
})
.get(cors.corsWithOptions, (req, res, next) => {
  Forums.find()
  .then(forum => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(forum);
  },
  err => {
    next(err);
  })
  .catch(err => {
    next(err);
  });
});

module.exports = forumRouter;
