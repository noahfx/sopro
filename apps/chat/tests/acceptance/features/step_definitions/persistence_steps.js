var PI = require('../../../../persistence-interface.js')();
var PICouch = require('../../../../persistence-couchdb');
PI.use(PICouch);

module.exports = function(){
  /*
   *  Scenario: persisting users
   */
  this.Given(/^I have configured a new user$/, function(next){
    this.user = {
      _id: 'persistence-test-user',
      username: 'persistence-test-user',
      identities: ['abc'],
    }
    next();
  });

  this.When(/^I "save" the user$/, function(next){
    var self = this;
    PI.create('user', this.user, function(err, body){
      console.log(err);
      console.log(body);
      self.createdUser = body;
      next(err);
    })
  });

  this.Then(/^the user is persisted$/, function(next){
    var self = this;
    PI.read('persistence-test-user', function(err){
      // Cleanup:
      PI.destroy(self.createdUser, next)
    })
  });

}