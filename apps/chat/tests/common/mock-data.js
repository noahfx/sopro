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
        "name": "random"
      },
      {
        "id": "C024BE91L",
        "name": "general"
      }
    ],
    "peers": [
      {"id": "C024BE91L","name": "andrew"},{"id": "C024BE91L","name": "bob"},{"id": "C024BE91L","name": "charlie"},{"id": "C024BE91L","name": "david"},{"id": "C024BE91L","name": "eli"},
      {"id": "C024BE91L","name": "austin"},{"id": "C024BE91L","name": "bojangles"},{"id": "C024BE91L","name": "cathy"},{"id": "C024BE91L","name": "dillon"},{"id": "C024BE91L","name": "elsie"},
      {"id": "C024BE91L","name": "arthur"},{"id": "C024BE91L","name": "babushka"},{"id": "C024BE91L","name": "communism"},{"id": "C024BE91L","name": "dustin"},{"id": "C024BE91L","name": "enigma"},
      {"id": "C024BE91L","name": "alexandra"},{"id": "C024BE91L","name": "boston"},{"id": "C024BE91L","name": "clark"},{"id": "C024BE91L","name": "darleen"},{"id": "C024BE91L","name": "ello"},
      {"id": "C024BE91L","name": "anonymous"},{"id": "C024BE91L","name": "bill"},{"id": "C024BE91L","name": "canadian"},{"id": "C024BE91L","name": "doogie"},{"id": "C024BE91L","name": "ermagerd"},
      {"id": "C024BE91L","name": "ayrton"},{"id": "C024BE91L","name": "badbear"},{"id": "C024BE91L","name": "chekhov"},{"id": "C024BE91L","name": "deckard"},{"id": "C024BE91L","name": "elaine"},
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
        }
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
