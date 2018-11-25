var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var SteamStrategy = require("passport-steam").Strategy;

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000/',
  apiKey: ''
},
function(identifier, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {

    // To keep the example simple, the user's Steam profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Steam account with a user record in your database,
    // and return that user instead.
    profile.identifier = identifier;
    console.log(profile)
    return done(null, profile);
    
  });
}
));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "the brown whatever goes woof",
  name: 'ur session id',
  resave: true,
  saveUninitialized: true
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + './public'));

app.use('/', indexRouter);
app.use('/account', indexRouter);


app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

// app.listen(3000);

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

console.log("listening");
module.exports = app;
