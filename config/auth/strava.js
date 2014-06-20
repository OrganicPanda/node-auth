var keys = require('./keys').strava
  , Strategy = require('passport-strava').Strategy
  , User = require('../../app/models/user');

/*var updateAndReturn = function(user, token, profile, done) {
  var name = profile.name.givenName
    , surname = profile.name.familyName;

  user.strava.id = profile.id;
  user.strava.token = token;
  user.strava.name = name + ' ' + surname;
  user.strava.email = profile.emails[0].value;

  user.save(function(err) {
    if (err) return done(err);
    return done(null, user);
  });
};*/

module.exports = function(passport) {
  passport.use(new Strategy({

    clientID      : keys.clientID,
    clientSecret  : keys.clientSecret,
    callbackURL   : 'http://127.0.0.1:8080/auth/strava/callback',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

  },
  function(req, token, tokenSecret, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // check if the user is already logged in
      if (!req.user) {

        User.findOne({ 'strava.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.strava.token) {
              user.strava.token       = token;
              user.strava.email       = profile._json.email;
              user.strava.displayName = profile.displayName;

              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }

            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser = new User();

            newUser.strava.id          = profile.id;
            newUser.strava.token       = token;
            newUser.strava.email       = profile._json.email;
            newUser.strava.displayName = profile.displayName;

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session

        user.strava.id          = profile.id;
        user.strava.token       = token;
        user.strava.email       = profile._json.email;
        user.strava.displayName = profile.displayName;

        user.save(function(err) {
          if (err)
            throw err;
          return done(null, user);
        });
      }

    });

  }));
};
