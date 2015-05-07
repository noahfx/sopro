module.exports = CAM_MOCKS = {
  validToken: "12345",
  roleId1: "abc",
  roleId2: "xyz",
  nonsubscribedRoleId: "foobar",
  nonsubscribedPeerId: "qwerty",
  subscribedPeerId: "uiop",
  displayedChannelCount: 2,
  newChannelName: "a name for the channel",
  getChannelsResponse1: {
    "ok": true,
    "channels": [
      {
        "id": "C024BE91L",
        "name": "general"
      },
      {
        "id": "C024BE91L",
        "name": "random"
      }
      
    ],
    "peers": [
      {"_id": "xyz","name": "thomas"},{"_id": "C024BE91L","name": "bob"},{"_id": "C024BE91L","name": "charlie"},{"_id": "C024BE91L","name": "david"},{"_id": "C024BE91L","name": "eli"},
      {"_id": "C024BE91L","name": "austin"},{"_id": "C024BE91L","name": "bojangles"},{"_id": "C024BE91L","name": "cathy"},{"_id": "C024BE91L","name": "dillon"},{"_id": "C024BE91L","name": "elsie"},
      {"_id": "C024BE91L","name": "arthur"},{"_id": "C024BE91L","name": "babushka"},{"_id": "C024BE91L","name": "communism"},{"_id": "C024BE91L","name": "dustin"},{"_id": "C024BE91L","name": "enigma"},
      {"_id": "C024BE91L","name": "alexandra"},{"_id": "C024BE91L","name": "boston"},{"_id": "C024BE91L","name": "clark"},{"_id": "C024BE91L","name": "darleen"},{"_id": "C024BE91L","name": "ello"},
      {"_id": "C024BE91L","name": "anonymous"},{"_id": "C024BE91L","name": "bill"},{"_id": "C024BE91L","name": "canadian"},{"_id": "C024BE91L","name": "doogie"},{"_id": "C024BE91L","name": "ermagerd"},
      {"_id": "C024BE91L","name": "ayrton"},{"_id": "C024BE91L","name": "badbear"},{"_id": "C024BE91L","name": "chekhov"},{"_id": "C024BE91L","name": "deckard"},{"_id": "C024BE91L","name": "elaine"},
    ]
  },
  getChannelsResponse2: {
    "ok": true,
    "channels": [
      {
        "id": "C024BE91L",
        "name": "developers"
      },
      {
        "id": "C024BE91L",
        "name": "general"
      },
      {
        "id": "C024BE91L",
        "name": "huevon"
      }
    ],
    "peers": [
      {
        "_id": "abc",
        "name": "louise"
      },
      {
        "_id": "xyz",
        "name": "thomas"
      },
      {
        "_id": "foobar",
        "name": "Foo Bar"
      }
    ]
  },
  postChannelResponse: {
    "ok": true,
    "channel": {
      "id": "C024BE91L",
      "name": "karmachannel",
      "creator": "U024BE7LH",
      "members": [
        {
          "id": "abc",
          "name": "davis"
        },
      ],
      "topic": "Fun stuff",
      "purpose": "just to have some fun",
    }
  },
  getChannelInfoResponse: {
    "ok": true,
    "channel": {
      "id": "C024BE91L",
      "name": "karmachannel",
      "creator": "U024BE7LH",
      "members": [
        {
          "id": "abc",
          "name": "davis"
        },
        {
          "id": "uiop",
          "name": "jhon"
        },
        {
          "id": "xyz",
          "name": "thomas"
        },
        {
          "id": "sopro",
          "name": "SoPro"
        },
      ],
      "topic": "Fun stuff",
      "purpose": "just to have some fun",
    }
  },
  getUsersResponse: {
    "ok":true,
    "users": [
      {"_id":"user-abc","_rev":"1-0ba2776c86039da5d47c80a0ca108175","soproModel":"user","roleids":["abc"],"username":"louise","realname":"Louise Adversity","email":"louise@centralservices.io"},
      {"_id":"user-xyz","_rev":"1-9e7dfdd166b0e53f7a3f5bbdff28a78d","soproModel":"user","roleids":["xyz"],"username":"thomas","realname":"Thomas, the Tank Engine","email":"choochoooooooooo@centralservices.io"}
    ]
  },
  postUserRequest: {
    email: "societyprotest@gmail.com",
    username: "societyProTest",
    realname: "SoPro I AM",
    emailPassword: "soProEncriptedPassword"
  }
  ,
  channelHistoryResponse : {
    ok : true,
    messages : [
      {
        ts : '1939400',
        text : "New"
      },
      {
        ts : '1939200',
        text : "Old"
      }
    ],
    channel : {}
  },
  postMessageResponse: {
    "ok": true,
    "message": {
      "_id": "unique-message-id",
      "channelid": "unique-channel-id",
      "authorid": "unique-identity-id",
      "text": "message text"
    }
  }
};
