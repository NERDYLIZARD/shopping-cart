/**
 * Created by Hoppies on 09-Mar-17.
 */

var csrf = require('csurf');
var express = require('express');
var multer = require('multer');
var passport = require('passport');

var Product = require('../models/product');

var upload = multer();
var router = express.Router();
var csrfProtection = csrf();
router.use(csrfProtection);

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
  req.session.previousUrl = req.headers.referer;
  res.render('product/product-form', {
    heading: "Add Product",
    url: "/product/add",
    overridingMethod: "POST",
    csrfToken: req.csrfToken(),
  });
});


router.post('/add', upload.single('productImage'), function (req, res, next) {

  var product = new Product({
    title:  req.body.title,
    description: req.body.description,
    price: +req.body.price,
    seller: req.user,
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype.split('/').pop()
    },
  });

  var previousUrl = req.session.previousUrl;
  product.save(function (err, product) {
    if(err) throw err;
    req.session.previousUrl = null;
    res.redirect(previousUrl);
  });

});

// Edit product
router.get('/form/:id', function (req, res, next) {
  var productId = req.params.id;

  Product.findById(productId, function (err, product) {
    if (!product.seller.equals(req.user._id)) {
      req.flash('error', "Unauthorized");
      return res.redirect('/');
    }
    req.session.previousUrl = req.headers.referer;
    res.render('product/product-form', {
      heading: "Edit Product",
      url: "/product/edit/" + productId,
      overridingMethod: "PATCH",
      title: product.title,
      description: product.description,
      price: product.price,
      csrfToken: req.csrfToken()
    });
  });
});


router.post('/edit/:id', upload.single('productImage'), function (req, res, next) {

  var productId = req.params.id;
  Product.findById(productId, function (err, product) {
    if (!product.seller.equals(req.user._id)) {
      req.flash('error', "Unauthorized");
      return res.redirect('/');
    }

    product.title =  req.body.title;
    product.description = req.body.description;
    product.price = +req.body.price;

    var previousUrl = req.session.previousUrl;
    if (!req.file) {
      product.save(function (err, product) {
        if (err) throw err;
        res.redirect(previousUrl);
      });
    } else {
      product.image.data = req.file.buffer;
      product.image.contentType = req.file.mimetype.split('/').pop();

      product.save(function (err, product) {
        if (err) throw err;
        res.redirect(previousUrl);
      });
    }
    req.session.previousUrl = null;
  });
});

router.get('/delete/:id', function (req, res, next) {
  var productId = req.params.id;

  Product.findById(productId, function (err, product) {
    if (!product.seller.equals(req.user._id)) {
      req.flash('error', "Unauthorized");
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      return res.redirect('back');

    }
    product.remove(function (err, product) {
      if (err) return res.write(err);
      // clear cache to prevent res return 304 i.e same content
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.redirect('back');
    });
  });
});


module.exports = router;


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/user/signin');
}

