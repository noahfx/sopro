var CAM_MOCKS = require('../../../mock-data.js');
var S_STEPS = require('../../shared_steps.js');
var SA_STEPS = require('../../sharedAPI_steps.js');
var acl = require('../../../../auth-matrix.js')();
var assert = require('assert');
/*
var PI = require('../../../../persistence-interface.js')();
var PICouch = require('../../../../persistence-couchdb');
PI.use(PICouch);
*/


module.exports = function(){
  /*
   * Scenario: GETting a list of users
   */
  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn);

  function authedForUsers(arg1, next){
    var shouldPass = !arg1;
    if(shouldPass){
      var userid = 'abc';
    } else {
      var userid = 'nonexistent';
    }

    acl.isAllowed(userid, '/api/users', 'get', function(err, ok){
      if(err){
        return next.fail('Authentication failure: '+err);
      }
      if(!ok){
        if(shouldPass){
          next.fail('Authentication failed; expected success: '+err+'\n'+ok);
        } else {
          next();
        }
      } else {
        if(shouldPass){
          next();
        } else {
          next.fail('Authentication passed; expected failure: '+err+'\n'+ok);
        }
      }
    })
  }

  this.Given(/^the authentication token is for an identity that is( not)? authorized to read users$/, 
    authedForUsers);

  this.When(/^I make the correct request via http GET$/, function(next){
    var self = this;
    this.soproRequest('https://localhost/api/users', function(err, res, body){
      if(err){
        return next.fail(err)
      }
      self.response = JSON.parse(body);
      next();
    })
  })

  this.Then(/^I should receive a list of local users$/, function(next){
    assert(this.response.users.length > 0);
    assert(this.response.users[0]._id !== undefined);
    next();
  })
}