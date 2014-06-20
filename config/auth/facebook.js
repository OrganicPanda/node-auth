var keys = require('./keys').facebook
  , Strategy = require('passport-facebook').Strategy
  , User = require('../../app/models/user');

var updateAndReturn = function(user, token, profile, done) {
  var name = profile.name.givenName
    , surname = profile.name.familyName;

	user.facebook.id = profile.id;
  user.facebook.token = token;
  user.facebook.name = name + ' ' + surname;
  user.facebook.email = profile.emails[0].value;

  user.save(function(err) {
    if (err) return done(err);
    return done(null, user);
  });
};

module.exports = function(passport) {
  passport.use(new Strategy({
    clientID: keys.appID,
    clientSecret: keys.appSecret,
    callbackURL: 'http://127.0.0.1:8080/auth/facebook/callback',
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);
          if (user && !!user.facebook.token)
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
