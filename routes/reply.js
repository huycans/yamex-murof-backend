const express = require("express");
const bodyParser = require("body-parser");
const Replies = require("../models/reply");
const Threads = require("../models/thread");
const authenticate = require("../authenticate");
const cors = require("./cors");

const replyRouter = express.Router();
replyRouter.use(bodyParser.json());


replyRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions,(req, res, next) => {
    let {thrid, page} = req.query;
    Replies.find({threadId: thrid})
    .then(replies => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(replies);
    },
      err => next(err)
    )
    .catch(err => {
      next(err);
    })
  })
  // .post(cors.cors,
  //   (req, res, next) => {
  //     // TODO: implement this
  //     console.log("Register a thank you");
  //     res.end("Register a thank you")
  //   }
  // )
  .post(cors.corsWithOptions, authenticate.verifyUser,
    (req, res, next) => {
      Threads.findById(req.body.threadId)
      .then((thread) => {
        if (thread == null){
          let err = new Error("Thread does not exist");
          return next(err);
        }
        else {
          Replies.create({
            name: req.body.name,
            author: req.body.author.id,
            threadId: req.body.threadId,
            content: req.body.content
          })
          .then(reply => {
            console.log("Reply created: ", reply.name);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(reply);
    
            Threads.findByIdAndUpdate(req.body.threadId, 
              { $set: { latestReply: reply._id }},
              {new: true}
            )
            .then((thread) => {
              console.log("Thread updated: latestReply");
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
  )

module.exports = replyRouter;