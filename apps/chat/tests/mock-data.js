module.exports = CAM_MOCKS = {
  validToken: "12345",
  roleId1: "abc",
  roleId2: "xyz",
  userId1: "qwerty",
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
  getChannelsResponse2: {
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
          "id": "C024BE91L",
          "name": "jhon"
        },
      ],
      "topic": "Fun stuff",
      "purpose": "just to have some fun",
    }
  }
}