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
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true,
}));

// Sign in
router.get('/signin', function(req, res, next) {
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
  });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true,
}));


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
