var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database');
var secret = require('./config/keys').secret;

mongoose.connect(configDB.url);

require('./app/passport')(passport);

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: secret, key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

app.listen(port);
console.log('Server started on port ' + port);
