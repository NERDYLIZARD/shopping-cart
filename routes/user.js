/**
 * Created by Hoppies on 01-Mar-17.
 */
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var async = require('async');

var User = require('../models/user');
var Order = require('../models/order');
var Product = require('../models/product');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {

  var locals = {};
  var tasks = [
    function (cb) {
      Order.find({user: req.user}, function (err, orders) {
        if (err)
          return res.write('Error!');

        var cart;
        orders.forEach(function (order) {
          cart = new Cart(order.cart);
          order.items = cart.getItems();
        });
        locals.orders = orders;
        cb();
      });
    },

    function (cb) {
      Product.find({seller: req.user}, function (err, products) {
        if (err) return res.write('Error!');
        locals.products = products;
        cb();
      });
    }
  ];

  async.parallel(tasks, function(err) {
    res.render('user/profile', {
      orders: locals.orders,
      products: locals.products
    });
  });


});

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

  var targetUrl = req.session.targetUrl;
  if(targetUrl) {
    req.session.targetUrl = null;
    res.redirect(targetUrl);
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

  var targetUrl = req.session.targetUrl;
  if(targetUrl) {
    req.session.targetUrl = null;
    res.redirect(targetUrl);
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
