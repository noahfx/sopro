var vertx = require('vertx');
console = require('vertx/console');
var eb = vertx.eventBus;

/*
 * MOCKS AND HELPER FUNCTIONS:
 */

load('tests/mock-data.js');   // they load into CAM_MOCKS

// authMiddleware is used to wrap each event bus handler function.
// The returned wrapper function is suitable for use as an event bus handler.
// It either replies with a verification failure message,
// or invokes the wrapped function `next` with the args (msg, replier)
function authMiddleware(next){
  return function(msg, replier){
    var params = JSON.parse(msg);
    tokenAuthentication(params.token, function(valid){
      if (!valid) {
        return replier(JSON.stringify({ok: false, error: "invalid_auth"}));
      } else {
        next(msg, replier);
      }
    });
  }
}

// tokenAuthentication takes a token and returns a boolean validity:
function tokenAuthentication(token, callback) {
  if (token === CAM_MOCKS.validToken) {
    callback(true);
  } else {
    callback(false);
  }
};

// Check whether a userid appears in a channel's member list:
function isMemberPresent(userid, channel){
  var userFound = false;
  channel.members.forEach(function(member){
    if(member.id === userid){
      userFound = true;
    }
  });
  return userFound;
};

/*
 * REGISTER EVENTBUS HANDLERS:
 */

var backend = {};
// Create a map of which topics should have which handlers.
// (The actual events will first be handled by a wrapper.)

backend.handlersMap = {
  'token.authentication': tokenAuthentication,
  'get.channels': getChannels,
  'channel.create': postChannel,
  'channel.info': getChannelInfo,
};
// For some reason we can't dynamically set property names above...
backend.handlersMap['user.'+CAM_MOCKS.subscribedPeerId+'.invites.channels'] = inviteToChannel;
backend.handlersMap['user.'+CAM_MOCKS.nonsubscribedPeerId+'.invites.channels'] = inviteToChannel;


for(topic in backend.handlersMap){
  // Skip unwanted prototypical properties:
  if(!backend.handlersMap.hasOwnProperty(topic)){
    continue;
  }

  // Create a wrapper for the appropriate handler to check auth:
  var wrapped = authMiddleware(backend.handlersMap[topic]);

  // Register this wrapper for this topic:
  eb.registerHandler(topic, wrapped);
}

/*
 * DEFINE EVENTBUS HANDLERS: 
 */

function getChannels(msg, callback) {
  var params = JSON.parse(msg);
  var channels = {ok: false, error: "role_not_found"};
  if (params.payload.role == CAM_MOCKS.roleId1){
    channels = CAM_MOCKS.getChannelsResponse1;
  } else if (params.payload.role == CAM_MOCKS.roleId2) {
    channels = CAM_MOCKS.getChannelsResponse2;
  }
  callback(JSON.stringify(channels));
};

function getChannelInfo(msg, callback){
  var params = JSON.parse(msg);
  var userid = params.requester;
  //var channel = findChannel(msg.payload.channel)
  var userFound = isMemberPresent(userid, CAM_MOCKS.getChannelInfoResponse.channel);
  if(!userFound){
    return callback(JSON.stringify({ok: false, error: "channel_not_found"}));
  }
  // Failure cases accounted for. Send back the info:
  return callback(JSON.stringify(CAM_MOCKS.getChannelInfoResponse));
}

function postChannel(msg, callback) {
  var params = JSON.parse(msg);
  var response = CAM_MOCKS.postChannelResponse;
  response.channel.name = params.payload.name;
  response.channel.creator = params.payload.role;
  response.channel.topic = params.payload.topic;
  response.channel.purpose = params.payload.purpose;
  response.channel.members = [params.payload.role];
  callback(JSON.stringify(response));

  if (params.requester == CAM_MOCKS.roleId1){
    CAM_MOCKS.getChannelsResponse1.channels.push(response.channel);
  } else if (params.requester == CAM_MOCKS.roleId2) {
    CAM_MOCKS.getChannelsResponse2.channels.push(response.channel);
  };

};


function inviteToChannel(msg, callback) {
  var params = JSON.parse(msg);

  if (params.payload.user == params.requester) {
    return callback(JSON.stringify({ok:false,error:"cant_invite_self"}));
  }

  var requesterFound = isMemberPresent(params.requester, CAM_MOCKS.getChannelInfoResponse.channel);
  if(!requesterFound){
    callback(JSON.stringify({ok:false,error:"not_in_channel"}));
  }

  var inviteeFound = isMemberPresent(params.payload.user, CAM_MOCKS.getChannelInfoResponse.channel);
  if(inviteeFound){
    callback(JSON.stringify({ok:false,error:"already_in_channel"}));
  }

  var response = CAM_MOCKS.postChannelResponse;
  callback(JSON.stringify(response));
}

