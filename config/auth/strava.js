var keys = require('./keys').strava
  , Strategy = require('passport-strava').Strategy
  , User = require('../../app/models/user');

var updateAndReturn = function(user, token, profile, done) {
  user.strava.id = profile.id;
  user.strava.token = token;
  user.strava.email = profile._json.email;
  user.strava.displayName = profile.displayName;

  user.save(function(err) {
    if (err) return done(err);
    return done(null, user);
  });
};

module.exports = function(passport) {
  passport.use(new Strategy({
    clientID      : keys.clientID,
    clientSecret  : keys.clientSecret,
    callbackURL   : 'http://127.0.0.1:8080/auth/strava/callback',
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({ 'strava.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);
          if (user && !!user.strava.token)
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
