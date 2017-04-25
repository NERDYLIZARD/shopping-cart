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
        helpers: {
          ifCond: function (v1, operator, v2, options) {
            switch (operator) {
              case '==':
                return (v1.equals(v2)) ? options.fn(this) : options.inverse(this);
              case '!=':
                return (!v1.equals(v2)) ? options.fn(this) : options.inverse(this);
            }
          }
        }
      });
    });
});


module.exports = router;
