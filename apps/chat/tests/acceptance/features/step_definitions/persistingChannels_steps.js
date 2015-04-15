var CAM_MOCKS = require('../../../common/mock-data.js');
var SA_STEPS = require('../../sharedAPI_steps.js');
var acl = require('../../../../auth-matrix.js')();
var PI = require('../../../../persistence-interface.js')();
var PICouch = require('../../../../persistence-couchdb');
var assert = require('assert');
PI.use(PICouch);

module.exports = function  () {

	function authorizedToCreateChannel(next) {
		var identityId = CAM_MOCKS.roleId1;
		acl.isAllowed(identityId, '/api/channel', 'post', function(err, ok){
	    if(err){
	      return next.fail('Authentication failure: '+err);
	    }
	    if(ok){
	      next();
	    } else {
	      next.fail('Authentication passed; expected failure: '+err+'\n'+ok);
	    }
	  });
	};

	function channelExits(arg1, next) {
		this.newChannel = (arg1)? "pending_channel_feature" : CAM_MOCKS.newChannelName; 
		next();
	};

	function postChannel(next) {
		var self = this;
		this.soproRequest({
	    uri: '/api/channel',
	    method: "POST",
      qs: {
        name: this.newChannel
      }
    },function (err, res, body) {
	    if(err){
	      return next.fail(err)
	    }
	    self.response = JSON.parse(body);
	    console.log(body);
	    next();
	  });
	};

	function persistedChannel(arg1, next) {
		var self = this;
		if (arg1) {
			assert(!this.response.ok);
		} else {
			assert(this.response.ok);
		}
		PI.find("channel","name", this.newChannel, function(err, results){
			if(err) {
				return next.fail(new Error(err));
			}
			assert(results.length == 1,results.length + " channels found for this new channel: " + self.newChannel);
			assert(results[0].name == self.newChannel, "Different Channel name found");
			PI.destroy(results[0], next);
		});  		
	}


/*
	Scenario: persisting a new channel
*/
  //  Given I have a valid authentication token
  this.Given(SA_STEPS.haveValidAuthToken.regex, SA_STEPS.haveValidAuthToken.fn);

  // And I am authorized to create a channel
  this.Given(/^I am authorized to create a channel$/, authorizedToCreateChannel);

  // And a given channel name does not exist
  this.Given(/^a given channel name does (not )?exist$/, channelExits);

  // When I POST that channel name
  this.When(/^I POST that channel name$/, postChannel);

  // Then that channel is persisted
  this.Then(/^that channel is (not )?persisted$/,	persistedChannel);

/*
  Scenario: persisting an existing channel
*/
	//  Given I have a valid authentication token
  this.Given(SA_STEPS.haveValidAuthToken.regex, SA_STEPS.haveValidAuthToken.fn);

  // And I am authorized to create a channel
  this.Given(/^I am authorized to create a channel$/, authorizedToCreateChannel);

  // And a given channel name does not exist
  this.Given(/^a given channel name does (not )?exist$/, channelExits);

  // When I POST that channel name
  this.When(/^I POST that channel name$/, postChannel);

  // Then that channel is persisted
  this.Then(/^that channel is (not )?persisted$/,	persistedChannel);    
   
  // And an error is returned
  this.Then(/^an error is returned$/, function(next) {
  	assert(this.response.error == "name_taken");
  	next();
  });

}