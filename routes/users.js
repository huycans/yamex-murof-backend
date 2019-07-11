var express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/user");
const cors = require("./cors");
var passport = require("passport");
var authenticate = require("../authenticate");
const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.post("/signup", cors.corsWithOptions, (req, res, next) => {
  Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    } else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.firstname = req.body.lastname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
          return;
        }
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration successful" });
        });
      });
    }
  });
});

userRouter.post("/login", cors.corsWithOptions,  (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    //if user doesn't exist, it does not count as an error, this info will be parsed in the info variable
    if (err) return next(err);
    if (!user){
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login unsuccessful", err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, status: "Login unsuccessful", err: "Could not log in user" });
      } 
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, token: token, status: "You are successfully login" });
    })
  })(req, res, next)
});

userRouter.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  function(req, res, next) {
    Users.find()
      .then(
        users => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  }
);

userRouter
  .route("/:userId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, function(req, res, next) {
    Users.findById(req.params.userId)
      .then(
        user => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  })
  .post(cors.cors, function(req, res, next) {
    Users.findByIdAndUpdate(req.query.userId, req.body, { new: true })
      .then(
        user => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  });


module.exports = userRouter;
