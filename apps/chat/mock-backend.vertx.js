var vertx = require('vertx');
console = require('vertx/console');
var eb = vertx.eventBus;

// set CAM_MOCKS:
load('tests/mock-data.js');

var backend = {};
backend.receive = {
  'token.authentication': tokenAuthentication,
  'get.channels': getChannels,
  'channel.create': postChannel,
  'channel.info': getChannelInfo
};

for(topic in backend.receive){
  if(!backend.receive.hasOwnProperty(topic)){
    continue;
  }
  eb.registerHandler(topic, backend.receive[topic]);
}

function tokenAuthentication(token, callback) {
  if (token === CAM_MOCKS.validToken) {
    callback(true);
  } else {
    callback(false);
  }
};


function getChannels(msg, callback) {
  var params = JSON.parse(msg); 
  tokenAuthentication(params.token, function (valid) {
    if (!valid) {
      return callback(JSON.stringify({ok: false, error: "invalid_auth"}));
    }
    var channels = {};
    if (params.payload.role == CAM_MOCKS.roleId1) {
      channels = CAM_MOCKS.getChannelsResponse1;
    } else if (params.payload.role == CAM_MOCKS.roleId2) {
      channels = CAM_MOCKS.getChannelsResponse2;
    }
    callback(JSON.stringify(channels));
  });
};

function getChannelInfo(msg, callback){
  var params = JSON.parse(msg);
  tokenAuthentication(params.token, function(valid){
    if(!valid){
      return callback(JSON.stringify({ok: false, error: "invalid_auth"}));
    }
    var userid = params.from_role;
    //var channel = findChannel(msg.payload.channel)
    var userFound = false;
    CAM_MOCKS.getChannelInfoResponse.channel.members.forEach(function(member){
      if(member.id === userid){
        userFound = true;
      }
    })
    if(!userFound){
      return callback(JSON.stringify({ok: false, error: "channel_not_found"}));
    }
    // Failure cases accounted for. Send back the info:
    return callback(JSON.stringify(CAM_MOCKS.getChannelInfoResponse));
  })
}

function postChannel(msg, callback) {
  var params = JSON.parse(msg); 
  tokenAuthentication(params.token, function (valid) {
    if (!valid) {
      return callback(JSON.stringify({ok: false, error: "invalid_auth"}));
    }
    var response = CAM_MOCKS.postChannelResponse;
    response.channel.name = params.payload.name;
    response.channel.creator = params.payload.role;
    response.channel.topic = params.payload.topic;
    response.channel.purpose = params.payload.purpose;
    response.channel.members = [params.payload.role];
    callback(JSON.stringify(response));
  });
};

eb.registerHandler('user.'+CAM_MOCKS.roleId1+'.invites.channels', function (msg, callback) {
  var params = JSON.parse(msg); 
  tokenAuthentication(params.token, function (valid) {
    if (!valid) {
      return callback(JSON.stringify({ok: false, error: "invalid_auth"}));
    }
    if (params.payload.user == CAM_MOCKS.roleId1) {
      callback(JSON.stringify({ok:false,error:"cant_invite_self"}));  
      return;
    }
    var response = CAM_MOCKS.postChannelResponse;
    callback(JSON.stringify(response));
  });
});

eb.registerHandler('user.'+CAM_MOCKS.userId1+'.invites.channels', function (msg, callback) {
  var params = JSON.parse(msg);
  tokenAuthentication(params.token, function (valid) {
    if (!valid) {
      return callback(JSON.stringify({ok: false, error: "invalid_auth"}));
    }
    if (params.payload.user != CAM_MOCKS.roleId1) {
      callback(JSON.stringify({ok:false,error:"not_in_channel"}));  
      return;
    }
    var response = CAM_MOCKS.postChannelResponse;
    callback(JSON.stringify(response));
  });
});
