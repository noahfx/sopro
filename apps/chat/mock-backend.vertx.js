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
  'channel.info': getChannelInfo,
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
  var channels = {};
  if (msg == CAM_MOCKS.roleId1) {
    channels = CAM_MOCKS.getChannelsResponse1;
  } else if (msg == CAM_MOCKS.roleId2) {
    channels = CAM_MOCKS.getChannelsResponse2;
  }
  callback(JSON.stringify(channels));
};

function getChannelInfo(msg, callback){
  tokenAuthentication(msg.token, function(valid){
    if(!valid){
      return callback({ok: false, error: "Invalid token"});
    }
    var userid = msg.from_role;
    //var channel = findChannel(msg.payload.channel)
    var userFound = false;
    CAM_MOCKS.getChannelInfoResponse.channel.members.forEach(function(member){
      if(member.id === userid){
        userFound = true;
      }
    })
    if(!userFound){
      return callback({ok: false, error: "You are not a member of this channel"})
    }
    // Failure cases accounted for. Send back the info:
    return callback(CAM_MOCKS.getChannelInfoResponse);
  })
}

function postChannel(msg, callback) {
  var response = CAM_MOCKS.postChannelResponse;
  var params = JSON.parse(msg);
  if (!params.name) {
    response = {"ok":false, "error":"no_channel"};
  } else {
    response.channel.name = params.name;
    response.channel.creator = params.roleID;
    response.channel.topic = params.topic;
    response.channel.purpose = params.purpose;
    response.channel.members = [params.roleID];
  }
  callback(JSON.stringify(response));
};
