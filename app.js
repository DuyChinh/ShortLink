var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var favicon = require("serve-favicon");
var logger = require('morgan');
const expressLayouts = require("express-ejs-layouts")
var session = require("express-session");
var flash = require("connect-flash");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var linkRouter = require("./routes/link");

const authRouter = require("./routes/auth");
const passport = require("passport");
const {User} = require('./models/index');
const passportLocal = require("./passports/passport.local");
const passportGoogle = require("./passports/passport.google");
const passportGithub = require("./passports/passport.github");
const authMiddleware = require("./middlewares/auth.middleware");
const guestMiddleware = require("./middlewares/guest.middleware");

var app = express();

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(
  session({
    secret: "dc",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use("local", passportLocal);
passport.use("google", passportGoogle);
passport.use("github", passportGithub);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
  //Read data from api
  // const user = await User.findByPk(id);
  done(null, user);
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/auth", guestMiddleware ,authRouter);
app.use(authMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/link", linkRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );




module.exports = app;
