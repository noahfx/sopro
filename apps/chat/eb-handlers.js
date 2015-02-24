// Register handlers for event bus messages

if(CAM === undefined){
  throw new Error('eb-handlers.js requires a global CAM object')
}

var eb = CAM.eb;

CAM.receive = {
  'token.authentication': tokenAuthentication,
  'get.channels': getChannels,
};

for(topic in CAM.receive){
  if(!CAM.receive.hasOwnProperty(topic)){
    continue;
  }
  console.log('Registering topic: '+topic);
  eb.registerHandler(topic, CAM.receive[topic]);
}

//*******************MOCKS****************************
function tokenAuthentication(token, callback) {
  if (token == "12345") {
    callback(true);
  } else {
    callback(false);
  }
};


function getChannels(msg, callback) {
  var channels = {};
  if (msg == "abc") {
    channels = {
      "ok": true,
      "channels": [
          {
              "id": "C024BE91L",
              "name": "random"
          },
          {
              "id": "C024BE91L",
              "name": "general"
          }
        ],
      "peers": [
          {
              "id": "C024BE91L",
              "name": "plato"
          },
          {
              "id": "C024BE91L",
              "name": "jimmy"
          }
        ]
    };
  } else if (msg == "xyz") {
    channels = {
      "ok": true,
      "channels": [
          {
              "id": "C024BE91L",
              "name": "developers"
          },
          {
              "id": "C024BE91L",
              "name": "huevon"
          },
          {
              "id": "C024BE91L",
              "name": "general"
          }
        ],
        "peers": [
          {
              "id": "C024BE91L",
              "name": "davis"
          },
          {
              "id": "C024BE91L",
              "name": "jhon"
          },
          {
              "id": "C024BE91L",
              "name": "jhon"
          }
        ]
    };
  }
  callback(JSON.stringify(channels));
};
//******************************************************

