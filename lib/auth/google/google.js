var keys = require('../../../config/keys').google
  , Strategy = require('passport-google-oauth').OAuth2Strategy
  , User = require('../../../app/models/user');

var updateAndReturn = function(user, token, profile, done) {
  user.google.id  = profile.id;
  user.google.token = token;
  user.google.name  = profile.displayName;
  user.google.email = profile.emails[0].value

  user.save(function(err) {
    if (err) return done(err);
    return done(null, user);
  });
};

module.exports = function(passport) {
  passport.use(new Strategy({
    clientID   : keys.clientID,
    clientSecret : keys.clientSecret,
    callbackURL  : 'http://127.0.0.1:8080/auth/google/callback',
    passReqToCallback: true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({ 'google.id': profile.id }, function(err, user) {
          if (err)
            return done(err);
          if (user && !!user.google.token)
            return done(null, user);

          // No user, create them
          updateAndReturn(new User(), token, profile, done);
        });
      } else {
        // Get user from request
        updateAndReturn(req.user, token, profile, done);
      }
    });
  }));
};
