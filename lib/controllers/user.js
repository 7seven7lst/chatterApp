var User = require('../models/user.js');
var Q = require('q');

exports.requireAuthentication = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    console.log("401 should be sent here...");
    return res.send(401);
    //res.redirect('/login');
  }
}

exports.signup = function(req, res, next){
  console.log("hit the signup function");
  var findOne = Q.nbind(User.findOne, User);
  findOne({username: req.body.username})
  .then(function(user){
    console.log("user from query is >>>>>", user);
    if (!user){
      // user doesn't exist, create a new one\
      var create = Q.nbind(User.create, User);
      var newUser = {username: req.body.username, password: req.body.password};
      return create(newUser);
    } else {
      // user already exist, redirect to sign in page
      res.send(409, 'already exist');
      //res.redirect('/signin');
    }
  })
  .then(function(user){
    res.json(200,user._id);
  })
  .fail(function(err){
    //next(err);
    console.log("error is >>>>", err);
    res.redirect('/signin');
  })
};

exports.login = function (req, res) {
  var user = req.user;
  console.log("req.user is >>>>>", req.user);
  res.json(user);
}

exports.isLoggedIn = function (req, res) {
  console.log("is request authenticated?????>>>>>>", req.isAuthenticated());
  res.send(req.isAuthenticated() ? req.user : false);
}

exports.serveProfile = function(req, res){
  console.log("here, profile page");
  res.json(200, {username: req.session.passport.user.username});
}

exports.serveIndex = function(req, res){
  console.log("here, homepage");
  res.sendFile('index.html');
}

exports.logout = function logout(req, res) {
  req.logOut();
  res.send(200);
}