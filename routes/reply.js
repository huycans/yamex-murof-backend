const express = require("express");
const bodyParser = require("body-parser");
const Replies = require("../models/reply");
const Threads = require("../models/thread");
const Users = require("../models/user");
const authenticate = require("../authenticate");
const cors = require("./cors");

const replyRouter = express.Router();
replyRouter.use(bodyParser.json());

replyRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
    let { thrid } = req.query;
    let perPage = 10;
    let page = Number(req.query.page) || 1;

    Replies.find({ threadId: thrid })
      .sort("-createdTime")
      .skip(perPage * page - perPage)//inefficient paginate technique
      .limit(perPage)
      .populate("author")
      .exec(function (err, replies) {
        if (err != null) return next(err);
        Replies.find({ threadId: thrid }).count().exec(function (err, count) {
          if (err != null) return next(err);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            replies: replies,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Threads.findById(req.body.threadId)
      .then(thread => {
        if (thread == null) {
          let err = new Error("Thread does not exist");
          return next(err);
        } else {
          Replies.create({
            name: req.body.name,
            author: req.body.author.id,
            threadId: req.body.threadId,
            content: req.body.content,
            numberOfThank: 0
          })
            .then(
              reply => {
                //update user's number of post
                Users.findByIdAndUpdate(reply.author._id,
                  {
                    $inc: { numberOfPost: 1 }
                  }
                )
                  .exec();
                // console.log("Reply created: ", reply.name);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(reply);

                Threads.findByIdAndUpdate(
                  req.body.threadId,
                  { $set: { latestReply: reply._id } },
                  { new: true }
                ).then(thread => {
                  console.log("Thread updated: latestReply");
                });
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

replyRouter
  .route("/:replyId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //register a thank you to this reply
    
    //increment reply's numberOfThank
    Replies.findByIdAndUpdate(req.params.replyId,
      { $inc: { numberOfThank: 1 }, },
      { new: true }
    )
      .exec(function (err, reply) {
        if (err) return next(err);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(reply);
      });
    
    //increment user's numberOfThank
    Users.findByIdAndUpdate(req.user.id,
      { $inc: { numberOfThank: 1 }, }
    )
      .exec();
  });
module.exports = replyRouter;
