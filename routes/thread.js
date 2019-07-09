const express = require("express");
const bodyParser = require("body-parser");
const Threads = require("../models/thread");
const Subforums = require("../models/subforum");
const Replies = require("../models/reply");
// const authenticate = require("../authenticate");
const cors = require("./cors");

const threadRouter = express.Router();
threadRouter.use(bodyParser.json());

threadRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    let { sfid, page } = req.query;
    Threads.find({
      subForumId: sfid
    })
    .populate("latestReply")
    .populate("firstReply")
    .populate("user")
    .then(
      threads => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(threads);
      },
      err => next(err)
    )
    .catch(err => {
      next(err);
    });
  })
  .put(cors.cors, (req, res, next) => {
    Subforums.findById(req.body.subForumId)
      .then(subforum => {
        if (subforum == null) {
          let err = new Error("Subforum does not exist");
          return next(err);
        } else {
          Threads.create({
            name: req.body.name,
            author: req.body.author.id,
            subForumId: req.body.subForumId,
            tag: null
          })
            .then(thread => {
                // create first reply in a thread, which copies the content of the thread
                Replies.create({
                  content: thread.name,
                  author: thread.author,
                  threadId: thread._id
                }).then(reply => {
                    // update firstReply and latestReply in thread
                    Threads.findByIdAndUpdate(thread._id, 
                      { $set: { firstReply: reply._id, latestReply: reply._id} },
                      { new: true }
                    )
                    .then((thread) => {
                      console.log("Thread created: ", thread.name);
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(thread);

                      Subforums.findByIdAndUpdate(
                        req.body.subForumId,
                        { $set: { latestThread: thread._id } },
                        { new: true }
                      ).then(
                        subforum => {
                          console.log("Subforum updated: latestThread");
                        },
                        err => {
                          next(err);
                        }
                      );
                    },
                    err => {
                      next(err);
                    })
                  },
                  err => {
                    next(err);
                  }
                );
              },
              err => {
                next(err);
              }
            )
            .catch(err => {
              next(err);
            });
        }
      })
      .catch(err => {
        next(err);
      });
  });

threadRouter
  .route("/latest")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    let { sfid } = req.query;
    Threads.find({ subForumId: sfid })
      .sort({ _id: -1 })
      .limit(10)
      .populate("latestReply")
      .populate("firstReply")
      .then(
        newest_threads => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(newest_threads);
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  });

threadRouter
  .route("/:threadId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Threads.findById(req.params.threadId)
      .populate("latestReply")
      .populate("firstReply")
      .then(
        thread => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(thread);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  });

module.exports = threadRouter;
