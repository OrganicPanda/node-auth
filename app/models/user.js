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

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// TODO: change these functions to be async
// http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
// bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) return next(err);

//     // hash the password along with our new salt
//     bcrypt.hash(user.password, salt, function(err, hash) {
//         if (err) return next(err);

//         // override the cleartext password with the hashed one
//         user.password = hash;
//         next();
//     });
// });

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
