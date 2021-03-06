var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Order = require('../models/order');
var Product = require('../models/product');


router.get('/', function (req, res, next) {
  if (!req.session.cart)
    return res.render('shop/shopping-cart', {items: null});

  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    items: cart.getItems(),
    totalPrice: cart.totalPrice
  });

})

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId)
    .select('-image')
    .exec(function (err, product) {
      if(err) return res.redirect('/');

      cart.add(product);
      req.session.cart = cart;
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.redirect('back');
    });

});

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart)
    return res.redirect('/cart');

  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {
    total: cart.totalPrice,
  });
})

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart)
    return res.redirect('/cart');

  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")(
    "sk_test_gnl471KUNlqnivfEfxKW5SNo"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    if(err) {
      req.flash('error', err.message);
      return res.redirect('/cart/checkout');
    }

    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });

    order.save(function (err, result) {
      req.flash('success', "Succesfully placed orders");
      req.session.cart = null;
      res.redirect('/');
    });
  });
});


router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  cart.reduceItem(productId);
  req.session.cart = cart;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.redirect('back');
});


router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);

  cart.removeItems(productId);
  req.session.cart = cart;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.redirect('back');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  req.session.targetUrl = "/cart" + req.url;
  res.redirect('/user/signin');
}
