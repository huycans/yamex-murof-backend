const express = require("express");
const bodyParser = require("body-parser");
const Threads = require("../models/thread");
const Subforums = require("../models/subforum");

// const authenticate = require("../authenticate");
const cors = require("./cors");

const threadRouter = express.Router();
threadRouter.use(bodyParser.json());


threadRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,(req, res, next) => {
    let { sfid, page } = req.query;
    Threads.find({
      subForumId: sfid
    })
    .then(threads => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(threads);
    },
      err => next(err)
    )
    .catch(err => {
      next(err);
    })
  })
  .put(cors.cors,
    (req, res, next) => {
      Subforums.findById(req.body.subForumId)
      .then((subforum) => {
        if (subforum == null){
          let err = new Error("Subforum does not exist");
          return next(err);
        }
        else {
          Threads.create({
            name: req.body.name,
            author: req.body.author.id,
            subForumId: req.body.subForumId,
            tag: null
          })
          .then(thread => {
            console.log("Thread created: ", thread.name);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(thread);
    
            Subforums.findByIdAndUpdate(req.body.subForumId, 
            { $set: { latestThread: thread._id }},
            {new: true}
            )
            .then((subforum) => {
              console.log("Subforum updated: latestThread");
            })
          },
          err => {
            next(err);
          })
          .catch(err => {
            next(err);
          });
        }
      })
      .catch(err => {
        next(err);
      });
    }
  );
  
threadRouter
  .route("/latest")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,(req, res, next) => {
    let {sfid} = req.query;
    Threads.find({subForumId: sfid})
    .sort({ _id: -1 }).limit(10)
    .then((newest_threads) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(newest_threads);
    },
    err => {
      next(err);
    })
    .catch(err => {
      next(err);
    });
  })

threadRouter
  .route("/:threadId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,(req, res, next) => {
    Threads.findById(req.params.threadId)
    .then((thread) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(thread);
    },
      err => next(err)
    )
    .catch(err => {
      next(err);
    })
  })


module.exports = threadRouter;