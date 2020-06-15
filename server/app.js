var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var config = require("./config")
var passport = require("passport");
var createError = require("http-errors");
var csp = require('express-csp-header');
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require("./routes/auth");
var forumRouter = require("./routes/forum");
var subforumRouter = require("./routes/subforum");
var threadRouter = require("./routes/thread");
var replyRouter = require("./routes/reply");

var app = express();
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use(express.static(path.resolve(__dirname, './react-ui/build')));
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, './react-ui/build', 'index.html'));
});



app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/forum", forumRouter);
app.use("/thread", threadRouter);
app.use("/subforum", subforumRouter);
app.use("/reply", replyRouter);

//connect to database
console.log("Connecting to db");
const url = process.env.MONGODB_URI || config.mongoUrl;
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then(
  db => {
    console.log("Connect correctly to the server");
  },
  error => {
    console.log(error);
  }
);

app.use(csp({
  policies: {
      'default-src': [csp.SELF],
      'img-src': [csp.SELF],
  }
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
