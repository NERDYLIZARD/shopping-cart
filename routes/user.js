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

router.get('/profile', function (req, res, next) {
  res.render('user/profile');
})

module.exports = router;
