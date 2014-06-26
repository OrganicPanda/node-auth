var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  strava: {
    id: String,
    token: String,
    email: String,
    displayName: String
  }
});

userSchema.methods.validPassword = function(password, done) {
  bcrypt.compare(password, this.local.password, function(err, valid) {
    if (err) return done(err);
    done(null, valid);
  });
};

userSchema.methods.generateHash = function(password, done) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return done(err);

    bcrypt.hash(password, salt, undefined, function(err, hash) {
      if (err) return done(err);
      done(null, hash);
    });
  });
};

module.exports = mongoose.model('User', userSchema);
