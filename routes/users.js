var express = require("express");

const user = express.Router();
user.use(bodyParser.json());

/* GET users listing. */
user
  .route("/")
  .post("/", function(req, res, next) {
    console.log("Update user info");
    res.end("Update user info");
});

user
  .route("/:userId")
  .get("/", function(req, res, next) {
    console.log("Return user info");
    res.end("Return user info");
});
module.exports = router;
