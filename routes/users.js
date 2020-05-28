var express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/user");
const cors = require("./cors");
var passport = require("passport");
var authenticate = require("../authenticate");
const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.post("/signup", cors.cors, (req, res, next) => {
  Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    } else {
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.favoriteBike) {
        user.favoriteBike = req.body.favoriteBike;
      }
      //placeholder info
      user.role = req.body.role || "user"
      user.avatarUrl = req.body.avatarUrl || "https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
      user.isActive = true;
      user.lastLogin = Date.now();

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
          return;
        }
        var token = authenticate.getToken({ _id: user._id });
        console.log("token:", token);
        if (user.salt) user.salt = undefined;
        if (user.hash) user.hash = undefined;
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, token: token, user: user, status: "Registration successful" });
        });
      });
    }
  });
});

userRouter.post("/login", cors.cors, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    //if user doesn't exist, it does not count as an error, this info will be parsed in the info variable
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login unsuccessful", err: info });
      return;
    }
    
    req.logIn(user, err => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, status: "Login unsuccessful", err: "Could not log in user" });
        return;
      }
      Users.findByIdAndUpdate(
        user._id, 
        { $set: { lastLogin:  Date.now() } },
        { new: true }
      )
      .then(user => {
        var token = authenticate.getToken({ _id: req.user._id });
        if (user.salt) user.salt = undefined;
        if (user.hash) user.hash = undefined;
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, token: token, user: user, status: "You are successfully login" });
      })
      
    });
  })(req, res, next);
})

userRouter.get("/checkJWTToken", cors.corsWithOptions, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid", success: true, user: user });
    }
  })(req, res);
});

//logging out this way DOESN'T work, user can still log in as usual, don't know why
//keep this in for completeness
userRouter.post("/logout", cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
  req.session.destroy(function () {  
    console.log("Log user out");
  });
  
});

//return all users
userRouter.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  function (req, res, next) {
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
  // get info about a user
  .get(cors.corsWithOptions, function (req, res, next) {
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
  //update info about a user
  .post(cors.corsWithOptions, function (req, res, next) {
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
