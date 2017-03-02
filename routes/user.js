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

// Sign up
router.get('/signup', function(req, res, next) {
  var errors = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    errors: errors,
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true,
}));

// Sign in
router.get('/signin', function(req, res, next) {
  var errors = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    errors: errors,
  });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true,
}));



router.get('/profile', function (req, res, next) {
  res.render('user/profile');
})

module.exports = router;
