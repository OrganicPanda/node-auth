var Strategy = require('passport-local').Strategy
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
  passport.use('local-login', new Strategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, email, password, done) {
    if (email)
      email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

    // asynchronous
    process.nextTick(function() {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

        // all is well, return user
        else
          return done(null, user);
      });
    });

  }));

  passport.use('local-signup', new Strategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, email, password, done) {
    if (email)
      email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

    // asynchronous
    process.nextTick(function() {
      // if the user is not already logged in:
      if (!req.user) {
        User.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error
          if (err)
            return done(err);

          // check to see if theres already a user with that email
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {

            // create the user
            var newUser      = new User();

            newUser.local.email  = email;
            newUser.local.password = newUser.generateHash(password);

            newUser.save(function(err) {
              if (err)
                throw err;

              return done(null, newUser);
            });
          }

        });
      // if the user is logged in but has no local account...
      } else if ( !req.user.local.email ) {
        // ...presumably they're trying to connect a local account
        var user      = req.user;
        user.local.email  = email;
        user.local.password = user.generateHash(password);
        user.save(function(err) {
          if (err)
            throw err;
          return done(null, user);
        });
      } else {
        // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
        return done(null, req.user);
      }

    });

  }));
};
