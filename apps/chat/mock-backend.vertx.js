var vertx = require('vertx');
console = require('vertx/console');
var eb = vertx.eventBus;

// set CAM_MOCKS:
load('tests/mock-data.js');

var backend = {};
backend.receive = {
  'token.authentication': tokenAuthentication,
  'get.channels': getChannels,
  'channel.create': postChannel

};

for(topic in backend.receive){
  if(!backend.receive.hasOwnProperty(topic)){
    continue;
  }
  console.log('Registering topic: '+topic);
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
    channels = CAM_MOCKS.channels2;
  }
  callback(JSON.stringify(channels));
};

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

eb.registerHandler('user.'+CAM_MOCKS.roleId1+'.invites.channels', function (msg, callback) {
  var params = JSON.parse(msg);
  if (params.user == CAM_MOCKS.roleId1) {
    callback(JSON.stringify({ok:false,error:"cant_invite_self"}));  
    return;
  }
  var response = CAM_MOCKS.postChannelResponse;
  callback(JSON.stringify(response));
});

eb.registerHandler('user.'+CAM_MOCKS.userId1+'.invites.channels', function (msg, callback) {
  var params = JSON.parse(msg);
  if (params.user == CAM_MOCKS.roleId2) {
    callback(JSON.stringify({ok:false,error:"not_in_channel"}));  
    return;
  }
  var response = CAM_MOCKS.postChannelResponse;
  callback(JSON.stringify(response));
});