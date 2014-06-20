var keys = require('./keys').google
  , Strategy = require('passport-google-oauth').OAuth2Strategy
  , User = require('../../app/models/user');

/*var updateAndReturn = function(user, token, profile, done) {
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
};*/

module.exports = function(passport) {
  passport.use(new Strategy({

    clientID    : keys.clientID,
    clientSecret  : keys.clientSecret,
    callbackURL   : 'http://127.0.0.1:8080/auth/google/callback',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

  },
  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // check if the user is already logged in
      if (!req.user) {

        User.findOne({ 'google.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);

          if (user) {

            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.google.token) {
              user.google.token = token;
              user.google.name  = profile.displayName;
              user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }

            return done(null, user);
          } else {
            var newUser      = new User();

            newUser.google.id  = profile.id;
            newUser.google.token = token;
            newUser.google.name  = profile.displayName;
            newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user         = req.user; // pull the user out of the session

        user.google.id  = profile.id;
        user.google.token = token;
        user.google.name  = profile.displayName;
        user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

        user.save(function(err) {
          if (err)
            throw err;
          return done(null, user);
        });

      }

    });

  }));
};
