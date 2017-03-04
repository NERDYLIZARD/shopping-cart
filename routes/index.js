var express = require('express');
var router = express.Router();

var Cart = require('../models/cart')
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {

  Product.find()
    .exec(function (err, products) {
      res.render('shop/index', {
        products: products,
      });
    })

});


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

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart)
    return res.render('shop/shopping-cart', {items: null});

  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    items: cart.getItems(),
    totalPrice: cart.totalPrice
  });

})



module.exports = router;
