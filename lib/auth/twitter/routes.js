module.exports = function(app, passport) {
  app.get('/auth/twitter', passport.authenticate('twitter', {
    scope: 'email'
  }));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/connect/twitter', passport.authorize('twitter', {
    scope: 'email'
  }));

  app.get('/connect/twitter/callback', passport.authorize('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/unlink/twitter', function(req, res) {
    var user = req.user;
    user.twitter.token = undefined;
    user.save(function() {
      res.redirect('/profile');
    });
  });
};
