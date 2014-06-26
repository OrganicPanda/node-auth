module.exports = function(app, passport) {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/connect/google', passport.authorize('google', {
    scope: ['profile', 'email']
  }));

  app.get('/connect/google/callback', passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/unlink/google', function(req, res) {
    var user = req.user
      , redirect = res.redirect.bind(res, '/profile');

    if (user && user.google) {
      user.google.token = undefined;
      user.save(redirect);
    } else {
      redirect();
    }
  });
};
