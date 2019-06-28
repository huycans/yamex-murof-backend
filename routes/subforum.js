const express = require("express");
const bodyParser = require("body-parser");
const Subforums = require("../models/subforum");
// const authenticate = require("../authenticate");
const cors = require("./cors");

const subforumRouter = express.Router();
subforumRouter.use(bodyParser.json());


subforumRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,(req, res, next) => {
    let {fid} = req.query;
    Subforums.find({
      forumId: fid
    })
    .populate("latestThread")
    .then(subforums => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(subforums);
    },
      err => next(err)
    )
    .catch(err => {
      next(err);
    })
  })
  .put(cors.cors,
    (req, res, next) => {
      Subforums.create({
        name: req.body.name,
        description: req.body.description,
				forumId: req.body.forumId,
        path: String(req.body.name).replace(/ /g,'').toLowerCase(),
      })
      .then(subforum => {
        console.log("Subforum created: ", subforum.name);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(subforum);
      },
      err => {
        next(err);
      })
      .catch(err => {
        next(err);
      });
    }
  )

module.exports = subforumRouter;