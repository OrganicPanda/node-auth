var Strategy = require('passport-local').Strategy
  , User = require('../../../app/models/user')
  , invalidLoginMessage = 'Email or Password Incorrect.';

var updateAndReturn = function(user, email, password, done) {
  user.local.email = email;

  user.generateHash(password, function(err, password) {
    if (err) return done(err);

    user.local.password = password;

    user.save(function(err) {
      if (err) return done(err);
      return done(null, user);
    });
  });
};

module.exports = function(passport) {
  passport.use('local-login', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      // TODO: case insensitive query
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, req.flash(
            'loginMessage', invalidLoginMessage
          ));
        }

        user.validPassword(password, function(err, valid) {
          if (err) return done(err);

          if (valid) {
            return done(null, user);
          } else {
            return done(null, false, req.flash(
              'loginMessage', invalidLoginMessage
            ));
          }
        });
      });
    });
  }));

  passport.use('local-signup', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      if (!req.user) {
        // TODO: case insensitive query
        User.findOne({ 'local.email':  email }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            return done(null, false, req.flash(
              'signupMessage', 'That email is already taken.'
            ));
          }

          // No user, create them
          updateAndReturn(new User(), email, password, done);
        });
      } else if (!req.user.local.email) {
        // Logged in but has no local login
        updateAndReturn(req.user, email, password, done);
      } else {
        // Already logged-in locally
        return done(null, req.user);
      }
    });
  }));
};
