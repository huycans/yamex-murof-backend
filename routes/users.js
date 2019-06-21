var express = require("express");
const bodyParser = require("body-parser");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter
  .route("/")
  .post( function(req, res, next) {
    console.log("Update user info");
    res.end("Update user info");
});

userRouter
  .route("/:userId")
  .get( function(req, res, next) {
    console.log("Return user info");
    res.end("Return user info");
});
module.exports = userRouter;
