"use strict"

const express = require('express');
const path =  require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

//changing name checking
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// import passport from 'passport';
// import Facebook from 'passport-facebook';
// import session from 'express-session';
// const FacebookStrategy = Facebook.Strategy;
//
// app.use(session({ secret:"hahaha" }));
app.use(express.static(path.join(__dirname, 'public')));
//
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "http://cd1d5ff9.ngrok.io/auth/facebook/callback",
//     profileFields: [],
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(accessToken, refreshToken, Object.keys(profile));
//     return cb(null, profile)
//   }
// ));
//
// passport.serializeUser((profile,done)=> {
//   done(null, profile);
// });
//
// passport.deserializeUser((profile,done)=> {
//   done(null, profile);
// });
//
// app.use(passport.initialize());
// app.use(passport.session());
//
// app.use('/',auth(passport));
app.use('/',routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(process.env.PORT||3000,()=> {
  console.log("starting to listen");
})
