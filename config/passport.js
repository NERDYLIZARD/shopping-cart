/**
 * Created by Hoppies on 01-Mar-17.
 */
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, function (req, email, password, done) {

  // validation
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();
    if (errors) {
      var message = errors.map(function (error) {
        return error.msg
      });
      return done(null, false, req.flash('error', message));
    }

    // check existing user
    User.findOne({'email': email}, function (err, user) {
      if(err)
        return done(err);
      if(user)
        // return done(null, false, {message: 'Email is already in use.'});
        return done(null, false, req.flash('error', 'Email is already in use.'));

      // add new user
      var newUser = new User();
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);
      newUser.save(function (err, result) {
        if(err)
          return done(err);
        return done(null, newUser);
      })
    })
  })
)