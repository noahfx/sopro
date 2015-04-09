var CAM_MOCKS = require('../../../mock-data.js');
module.exports = function(){
/*
	Scenario: automatically generating an API token
*/
	this.Given(/^I am authorized to create new users$/, function (next) {
  	var acl = require('../../../../auth-matrix.js')();
  	var userid = "abc";
    acl.isAllowed(userid, '/api/users', 'post', function(err, ok){
      if(err){
        return next.fail('Authentication failure: '+err);
      }
      if(ok){
        next();
      } else {
        next.fail('Authentication fail; expected success: '+err+'\n'+ok);
      }
    });
	});
	this.When(/^I create a new user$/, function (next) {
		this.soproRequest('https://localhost/api/users',
      {
        method: "POST",
        qs: {
          username: CAM_MOCKS.postUserRequest.username,
          realname: CAM_MOCKS.postUserRequest.realname,
          email: CAM_MOCKS.postUserRequest.email,
        },
      },
       function(err, res, body){
      if(err){
        return next.fail(err)
      }
      var response = JSON.parse(body);
      if (response.ok) {
      	next();
      } else {
      	next.fail(new Error(response.error));
      }
    })
	});
	this.Then(/^an API token should be automatically generated for that user$/, function (next) {
		var PI = require('../../../../persistence-interface.js')();
    var PICouch = require('../../../../persistence-couchdb');
    PI.use(PICouch);
    PI.find("user","username",CAM_MOCKS.postUserRequest.username, function () {
    	if(err){
      	return next.fail(new Error(err));
      }
      if(results.length === 1){  // found this token
        var userId = results[0]
        // Pending
      } else {
      	return next.fail(new Error("User not found"));
      }
    });
	});

/*
	Scenario: viewing the API token via http
*/
	this.Given(/^I have an authenticated session$/,function (next) { // Maybe change it to I started the chatlog application

	});

	this.When(/^I go to the correct route$/,function (next) {

	});

	this.Then(/^I should see my API token$/,function (next) {

	});

/*
	Scenario: transforming the token into a user
*/
	this.Given(/^I have a valid token associated with a user$/,function (next) {

	});

	this.When(/^I make a request to the API with that token$/,function (next) {

	});

	this.Then(/^the server should use that user$/,function (next) {

	});	
}