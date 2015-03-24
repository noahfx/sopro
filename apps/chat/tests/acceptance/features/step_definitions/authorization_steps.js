var S_STEPS = require('../../shared_steps.js');
var acl = require('../../../../auth-matrix.js')();

module.exports = function(){

  function userIsAuthorized(arg1, next){
    var shouldPass = !arg1;
    this.action = 'get';
    this.object =
    (shouldPass
    ? '/'
    : '/api/denyauth');

    acl.isAllowed(this.authenticatedUserId, this.object, this.action, function(err, ok){
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
  };

  function performAction(next){
    var self = this;
    this.soproRequest('https://localhost'+self.object, {method: self.action}, function(err, res, body){
      if(err){
        return next.fail(err);
      } else {
        self.response = res;
        next();
      }
    })
  }

  function actionWasPerformed(arg1, next){
    var expectedOK = !arg1;
    var code = this.response.statusCode;
    if(expectedOK){
      if(code == 200){
        next();
      } else {
        next.fail(new Error('Expected 200 response; got '+code))
      }
    } else {
      if(code == 404){
        next();
      } else {
        next.fail(new Error('Expected 404 not found; got '+code))
      }
    }
  }

  /*
   *  Scenario: checking user authorization for success
   */
  this.Given(S_STEPS.usingEE.regex,
    S_STEPS.usingEE.fn)

  this.Given(/^there is an authenticated user$/,
    S_STEPS.iAuthenticate.fn);

  this.Given(/^that user is( not)? authorized to perform an action on an object$/, 
    userIsAuthorized);

  this.When(/^the user performs that action on that object$/,
    performAction);

  this.Then(/^the action should( not)? be performed$/,
    actionWasPerformed);

  /*
   *  Scenario: checking user authorization for failure
   */
  this.Given(S_STEPS.usingEE.regex,
    S_STEPS.usingEE.fn)

  this.Given(/^there is an authenticated user$/,
    S_STEPS.iAuthenticate.fn);

  this.Given(/^that user is( not)? authorized to perform an action on an object$/, 
    userIsAuthorized);

  this.When(/^the user performs that action on that object$/,
    performAction);

  this.Then(/^the action should( not)? be performed$/,
    actionWasPerformed);
}