module.exports = function(app){
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy;
  passport.use(new LocalStrategy(checkAuthCouchdb));
  /*
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
  */

  // Take a user and turn it into a unique key for the session identifier
  passport.serializeUser(function(user, done) {
    done(null, user.userid);
  });

  // Take the session identifier and turn it into a unique key for a user
  passport.deserializeUser(function(id, done) {
    done(null, {userid:'passportuser'});
  });

  return passport;
}



function checkAuthCouchdb(username, password, done){
  console.log('passport verification callback');
  // test: assume success
  done(null, {userid:'passportuser'})
}
