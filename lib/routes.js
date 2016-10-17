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
        console.log("inside findone user>>>>>", err, user);

        if (!user) {
          return done( null, false, {messge: 'This user is not registered.'});
        }
        
        if (!user.comparePasswords(password)){
          return done(null, false, {message: 'This password is not correct'});
        }
        
        return done(null, user);
      })
      .fail(function(err){
        console.log("failed at here");
        return done(null, false, {message: "Server have difficulty"});
      })
    }
  ));

  passport.serializeUser(function(user, done){
    console.log("serializing user is >>>>>>", user);
    done(null, user.username);
  });
  passport.deserializeUser(function(id, done){
    User.findOne({
      _id: id
    }, '-salt -password', function(err, user) { // don't ever give out the password or salt
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
