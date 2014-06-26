module.exports = function(app, passport) {
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/connect/facebook', passport.authorize('facebook', {
    scope: 'email'
  }));

  app.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/unlink/facebook', function(req, res) {
    var user = req.user
      , redirect = res.redirect.bind(res, '/profile');

    if (user && user.facebook) {
      user.facebook.token = undefined;
      user.save(redirect);
    } else {
      redirect();
    }
  });
};
