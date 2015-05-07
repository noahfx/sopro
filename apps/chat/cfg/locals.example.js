module.exports = {
  amazon: {
    mailerSES: {
      accessKeyId : 'AAAAAAAAAAAAAAAAAAAA',
      secretAccessKey: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      region: 'us-east-1',
    },
    mailerSMTP: { // Unused now, but easy to plug in with our mailer lib
      username: 'AAAAAAAAAAAAAAAAAAAA',
      password: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    }
  },
  pubnub: {
    publish_key   : "pub-c-111111111111111111111111111111111111",
    subscribe_key : "sub-c-222222222222222222222222222222222222",
    secret_key: "sec-c-333333333333333333333333333333333333333333333333",
  }
}