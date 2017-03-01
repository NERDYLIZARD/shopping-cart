/**
 * Created by Hoppies on 01-Mar-17.
 */
var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

var User = require('../models/user');

router.get('/signup', function(req, res, next) {
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
  });
});

router.post('/signup', function (req, res, next) {
  res.redirect('/');
});



module.exports = router;
