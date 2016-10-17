var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var user = require('./controllers/user.js');
var User = require('./models/user.js');
var Q = require('q');

module.exports = function(app) {

  // setup passport
  passport.use(new LocalStrategy(
    function(username, password, done){
      console.log("username and password is >>>>>", username, password);
      var findOne = Q.nbind(User.findOne, User);
      findOne({"username": username})
      .then(function(user){
        console.log("inside findone user>>>>>",  user);

        if (!user) {
          return done( null, false, {messge: 'This user is not registered.'});
        }
        
        if (!user.comparePasswords(password)){
          return done(null, false, {message: 'This password is not correct'});
        }
        
        return done(null, user._id);
      })
      .fail(function(err){
        console.log("failed at here");
        return done(null, false, {message: "Server have difficulty"});
      })
    }
  ));

  passport.serializeUser(function(id, done){
    console.log("serializing user is >>>>>>", id);
    done(null, id);
  });
  passport.deserializeUser(function(id, done){
    console.log("inside deserialize>>>> id is >>>>", id);
    User.findOne({
      _id: id
    }, '-salt -password -__v -username', function(err, user) { // don't ever give out the password or salt
    console.log("deserializing, user is >>>>>", user);
      done(err, user);
    });
  });

  //// routes 
  app.get('/', user.serveIndex);

  app.post('/api/login', passport.authenticate('local'), user.login);

  app.post('/api/signup', user.signup);

  app.get('/api/loggedin', user.isLoggedIn);

  app.get('/api/profile', user.requireAuthentication, user.serveProfile);

  app.get('/api/logout', user.logout);


  app.get('*', function(req, res){
    res.redirect('/');
  })


}
