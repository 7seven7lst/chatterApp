'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    Q = require('q'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }, 
  password: {
    type: String,
    required: true
  },
  salt: String
})

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.methods.getHashedPassword = function (password) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      defer.reject(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(savedPassword, salt, function(err, hash) {
      if (err) {
        defer.reject(err);
      }

      // override the cleartext password with the hashed one
      defer.resolve(hash);
    });
  });
  return defer.promise;
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  user.salt = salt;
  next();
});
module.exports = mongoose.model('user', UserSchema);