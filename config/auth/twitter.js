var keys = require('./keys').twitter
  , Strategy = require('passport-twitter').Strategy
  , User = require('../../app/models/user');

var updateAndReturn = function(user, token, profile, done) {
  user.twitter.id = profile.id;
  user.twitter.token = token;
  user.twitter.username = profile.username;
  user.twitter.displayName = profile.displayName;

  user.save(function(err) {
    if (err) return done(err);
    return done(null, user);
  });
};

module.exports = function(passport) {
  passport.use(new Strategy({
    consumerKey   : keys.consumerKey,
    consumerSecret  : keys.consumerSecret,
    callbackURL   : 'http://127.0.0.1:8080/auth/twitter/callback',
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);
          if (user && !!user.twitter.token)
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
