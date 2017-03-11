/**
 * Created by Hoppies on 09-Mar-17.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var passport = require('passport');

var Product = require('../models/product');


router.get('/:id/image', function (req, res, next) {
  Product.findById(req.params.id, function (err, product) {
    res.contentType(product.image.contentType);
    res.send(product.image.data);
  });
});


// Route guard
router.use('/', isLoggedIn, function (req, res, next) {
  next();
})

// Add product
router.get('/form', function (req, res, next) {
  res.render('product/product-form', {
    heading: "Add Product",
    url: "/product/add",
    overridingMethod: "POST"
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

// Edit product
router.get('/form/:id', function (req, res, next) {
  var productId = req.params.id;

  Product.findById(productId, function (err, product) {

    res.render('product/product-form', {
      heading: "Edit Product",
      url: "/product/edit/" + productId,
      overridingMethod: "PATCH",
      title: product.title,
      description: product.description,
      price: product.price,
    });
  });
});


router.post('/edit/:id', function (req, res, next) {

  var productId = req.params.id;
  Product.findById(productId, function (err, product) {
    product.title =  req.body.title;
    product.description = req.body.description;
    product.price = +req.body.price;

    if (!req.body.productImage) {
      product.save(function (err, product) {
        if (err) throw err;
        res.redirect('/');
      });
    } else {
      fs.readFile(req.body.productImage, function (err, data) {
        product.image.data = data;
        product.image.contentType = req.body.productImage.split('.').pop();

        product.save(function (err, product) {
          if (err) throw err;
          res.redirect('/');
        });
      });
    }
  });
});

router.get('/delete/:id', function (req, res, next) {
  var productId = req.params.id;
  Product.remove({_id: productId}, function (err, product) {
    if (err) return res.write(err);
    res.redirect('/');
  });
});


module.exports = router;


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/user/signin');
}

