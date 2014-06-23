function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	require('../lib/auth/local/routes')(app, passport);
	require('../lib/auth/facebook/routes')(app, passport);
	require('../lib/auth/twitter/routes')(app, passport);
	require('../lib/auth/google/routes')(app, passport);
	require('../lib/auth/strava/routes')(app, passport);
};
