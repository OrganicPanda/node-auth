module.exports = function(app, passport) {
  app.get('/auth/strava', passport.authenticate('strava'));

  app.get('/auth/strava/callback', passport.authenticate('strava', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/connect/strava', passport.authorize('strava'));

  app.get('/connect/strava/callback', passport.authorize('strava', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/unlink/strava', function(req, res) {
    var user = req.user;
    user.strava.token = undefined;
    user.save(function() {
      res.redirect('/profile');
    });
  });
};
