var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var multer = require('multer');
var path = require('path');
var fs = require("fs");

var cloudinary = require("../cloudinary_config");
const Users = require("../models/user");
const cors = require("./cors");
var authenticate = require("../authenticate");
var upload = require("../multer");

const userRouter = express.Router();
const AVATAR_FIELD_NAME = "avatarFile";

userRouter.use(bodyParser.json());

userRouter.post("/signup", cors.cors, (req, res, next) => {
  Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    } else {
      user.email = req.body.email || "";
      user.favoriteBike = req.body.favoriteBike || "";

      //placeholder info
      user.role = req.body.role || "user";
      user.avatarUrl = req.body.avatarUrl || "";
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
        { $set: { lastLogin: Date.now() } },
        { new: true }
      )
        .then(user => {
          var token = authenticate.getToken({ _id: req.user._id });
          if (user.salt) user.salt = undefined;
          if (user.hash) user.hash = undefined;
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, token: token, user: user, status: "You are successfully login" });
        });

    });
  })(req, res, next);
});

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
  .put(cors.cors, function (req, res, next) {
    //middleware to auth user
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) return next(err);
      //make sure the user doing the request is the same as the user whose info is being updated
      if (user.id != req.params.userId) {
        var err = new Error("You are not authorized to perform this operation");
        err.status = 403;
        return next(err);
      }

      //set local var for next middleware to use
      res.locals.userId = user.id;
      return next();
    })(req, res, next);
  },
    function (req, res) {
      //middleware to deal with image upload
      upload.single(AVATAR_FIELD_NAME)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json(err);
        } else if (err) {
          return res.status(500).json(err);
        }

        //if there's a image file
        if (req.file) {
          //manually set the path to the file
          const pathToFile = path.join(__dirname, "../", "/temp-img/", req.file.filename);

          //upload image to cloudinary
          cloudinary.uploader.upload(pathToFile,
            { public_id: "user_avatar/" + res.locals.userId + req.imgNonce },
            function (error, result) {
              if (error) return next(error);
              //delete the temp image
              fs.unlink(pathToFile, (err) => {
                if (err) {
                  console.error(err);
                  return;
                }
              });

              //set avatarUrl to the public id of the image in cloudinary
              req.body.avatarUrl = result.public_id;

              //update user info
              Users.findByIdAndUpdate(res.locals.userId, req.body, { new: true })
                .then(
                  user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user);
                    return;
                  },
                  err => next(err)
                )
                .catch(err =>
                  next(err)
                );
            });
        }
        //update user info
        Users.findByIdAndUpdate(res.locals.userId, req.body, { new: true })
          .then(
            user => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(user);
              return;
            },
            err => next(err)
          )
          .catch(err =>
            next(err)
          );

      });
    }
  );


module.exports = userRouter;
