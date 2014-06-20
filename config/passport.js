var User = require('../app/models/user');

module.exports = function(passport) {
  require('./auth/local')(passport);
  require('./auth/facebook')(passport);
  require('./auth/twitter')(passport);
  require('./auth/google')(passport);
  require('./auth/strava')(passport);

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
