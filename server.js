var express = require('express')
  , app = express()
  , port = process.env.PORT || 8080
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash = require('connect-flash')
  , morgan = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , configDB = require('./config/database')
  , secret = require('./config/keys').secret

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
