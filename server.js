var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

var config = require('./lib/config.js');
var db = mongoose.connect(config.mongo.uri);
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




require('./lib/routes')(app);

app.listen(8080, function(){
  console.log("listening on port 8080");
})