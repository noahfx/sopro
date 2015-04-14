var CAM_MOCKS = require('../../../common/mock-data.js');
var S_STEPS = require('../../shared_steps.js');
var SA_STEPS = require('../../sharedAPI_steps.js');
var acl = require('../../../../auth-matrix.js')();
var assert = require('assert');

module.exports = function(){
  /*
    Scenario: PUTting a user
    Given I have a valid authentication token
    And the authentication token is for a role with the authorization to edit that user's data
    When I make the correct https PUT request with edited user data
    Then the user data should be updated
  */
  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn);

  this.Given(/^the authentication token is for an identity with the authorization to (GET|POST|PUT) (.*)$/,
  function(arg1, arg2, next){
    if(arg1 === undefined || !arg2 === undefined){
      return next.fail('Authorization endpoint not found')
    }
    var method = arg1;
    var route = arg2;
    // Try whatever the current token is:
    acl.isAllowed(this.validAuthToken, route, method.toLowerCase(), function(err, ok){
      if(err){
        return next.fail('Authentication failure: '+err);
      }
      if(ok){
        next();
      } else {
        // Set a known admin identity to ensure that any action is allowed:
        this.validAuthToken = CAM_MOCKS.validToken;
        next();
      }
    });
  })

  this.When(/^I make the correct https PUT request with edited user data$/, function(next){
    var self = this;
    var body = {
      _id: 'user-to-be-edited',
      username: 'edited username',
      email: 'edited email',
    }
    this.soproRequest({
      uri: 'api/users',
      method: 'PUT',
      json: true,
      body: body,
    }, function(err, res, body){
      if(!err){
        self.response = body;
        next();
      } else {
        next(err);
      }
    })
  });

  this.Then(/^the user data should be updated$/, function (next){
    // Write code here that turns the phrase above into concrete actions
    assert(this.response.ok, 'response.ok falsy');
    assert(this.response.user.username === 'edited username', 'unexpected username');
    assert(this.response.user.email === 'edited email', 'unexpected email');
    next();
  });
}