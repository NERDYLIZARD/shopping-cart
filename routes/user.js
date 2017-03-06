/**
 * Created by Hoppies on 01-Mar-17.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('user/profile');
})

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
})


// Not Login
router.use('/', notLoggedIn, function (req, res, next) {
  next();
})

// Sign up
router.get('/signup', function(req, res, next) {
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true,
}), function (req, res, next) {

  var previousUrl = req.session.previousUrl;
  if(previousUrl) {
    req.session.previousUrl = null;
    res.redirect(previousUrl);
  } else
    res.redirect('/user/profile');

});

// Sign in
router.get('/signin', function(req, res, next) {
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
  });
});

router.post('/signin', passport.authenticate('local.signin', {

  failureRedirect: '/user/signin',
  failureFlash: true,
}), function (req, res, next) {

  var previousUrl = req.session.previousUrl;
  if(previousUrl) {
    req.session.previousUrl = null;
    res.redirect(previousUrl);
  } else
    res.redirect('/user/profile');

});


module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
  if(!req.isAuthenticated())
    return next();
  res.redirect('/');
}
