/**
 * Created by Hoppies on 09-Mar-17.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');

var Product = require('../models/product');


router.get('/form', function (req, res, next) {
  res.render('product/product-form', {heading: "Add"});

});


router.get('/:id/image', function (req, res, next) {

  Product.findById(req.params.id, function (err, product) {
    res.contentType(product.image.contentType);
    res.send(product.image.data);
  });
});


router.post('/add', function (req, res, next) {

  var product = new Product();

  fs.readFile(req.body.productImage, function (err, data) {
    product.image.data = data;
    // get extension
    product.image.contentType = req.body.productImage.split('.').pop();
    product.title =  req.body.title;
    product.description = req.body.description;
    product.price = +req.body.price;
    product.seller = req.user;

    product.save(function (err, product) {
      if(err) throw err;
      res.redirect('/');
    });

  });
});

module.exports = router;
