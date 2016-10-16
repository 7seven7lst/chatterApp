var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// setup passport
passport.use(new LocalStrategy(
  function(username, password, done){
    if (username !== 'test' || password !='password'){
      console.log("not loged in ");
      return done(null, false); // login failed
    } else {
      console.log("somehow we are here");
      return done(null, {username: username});
    }
  }

));



passport.serializeUser(function(user, done){
  done(null, user);
});
passport.deserializeUser(function(user, done){
  done(null, user);
})

// middleware function to handle protected route
var requireAuthentication = function(req, res, next){
  if (req.isAuthenticated()){
    next();
  } else {
    console.log("401 should be sent here...");
    res.sendStatus(401);
    //res.redirect('/login');
  }
}

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // middleware to parse the form data
app.use(express.static(__dirname + '/public')); // server static file in public folder. 
app.use('/bower_components',  express.static(__dirname + '/bower_components')); 
app.use(cookieParser()); 
app.use(session({
  secret: 'make this a good secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
  console.log("here, homepage");
  res.sendFile('index.html');
})


app.post('/signin', passport.authenticate('local', {
  successRedirect: '/profile', failureRedirect: '/login'
}), function(req, res){
  res.send(req.user);
});


app.get('/profile', [requireAuthentication,
function(req, res){
  console.log("here, profile page");
  res.json(200, {username: req.session.passport.user.username});
}])

app.get('*', function(req, res){
  res.redirect('/');
})

app.listen(8080, function(){
  console.log("listening on port 8080");
})