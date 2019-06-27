var express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/user");
const cors = require("./cors");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter
  .route("/:userId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.cors, function(req, res, next) {
    Users.findByIdAndUpdate(req.query.userId, req.body, {new: true})
    .then((user) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(user);
    },
      err => next(err)
    )
    .catch(err => {
      next(err);
    })
});

userRouter
  .route("/:userId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, function(req, res, next) {
    Users.findById(req.params.userId)
    .then((user) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(user);
    },
    err => next(err)
  )
  .catch(err => {
    next(err);
  })
});

module.exports = userRouter;
