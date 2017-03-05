var express = require('express');
var router = express.Router();

var Cart = require('../models/cart')
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

  Product.findById(productId, function (err, product) {
    if(err) return res.redirect('/');

    cart.add(product);
    req.session.cart = cart;
    res.redirect('/');
  });

});

router.get('/checkout', function (req, res, next) {
  if (!req.session.cart)
    return res.redirect('/cart');

  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {
    total: cart.totalPrice,
  });
})

router.post('/checkout', function (req, res, next) {
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

    req.flash('success', "Succesfully placed orders");
    req.session.cart = null;
    res.redirect('/');

  });

});


module.exports = router;
