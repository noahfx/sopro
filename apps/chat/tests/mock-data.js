module.exports = CAM_MOCKS = {
  validToken: "12345",
  roleId1: "abc",
  roleId2: "xyz",
  displayedChannelCount: 2,
  newChannelName: "a name for the channel",
  channels1: {
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
  },
  channels2: {
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
  },
  channels3: {
    "ok": true,
    "channels": [
      {"name": "general"},
      {"name": "test"},
      {"name": "devs"},
      {"name": "random"},
      {"name": "stuff"},
      {"name": "channel2"}
    ],
    "peers": [
      {"name": "Jimmy"},
      {"name": "Mario"},
      {"name": "jorge"},
      {"name": "maria"},
      {"name": "jhon"},
      {"name": "peersito"}
    ]
},
  postChannelResponse: {
    "ok": true,
    "channel": {
      "id": "C024BE91L",
      "name": "karmachannel",
      "creator": "U024BE7LH",
      "members": [],
      "topic": "Fun stuff",
      "purpose": "just to have some fun",
    }
  }
}