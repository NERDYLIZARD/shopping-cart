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


module.exports = router;
