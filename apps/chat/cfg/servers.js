module.exports = CAM_CONFIG_SERVERS = {
  express: {
    host: 'localhost',
    port: 8080,
    sslEnabled: true,
    sslPort: 8443,
    sslOptions: {
      keyfile: 'cfg/ssl/192.168.10.206.key',
      certfile: 'cfg/ssl/192.168.10.206.crt',
      fingerprint: '1E:DE:9A:80:2D:98:51:D9:25:A5:F3:A4:3B:BD:89:21:7C:9D:DB:A2',
    },
    runtimeGroup: "ubuntu",
    runtimeUser: "ubuntu"
  },
  couchdb: {
    host: 'localhost',
    port: 5984,
    url: 'http://localhost:5984',
    //url: "https://admin:sopassword@sopro.iriscouch.com",
    db: 'mocks',
    //host: "sopro.iriscouch.com",
    //user: "admin",
    //pass: "sopassword",
  },
  vertx: {
    host: 'localhost',
    port: 3333,
    prefix: '/eventbus',
    eburl: 'http://localhost:3333/eventbus'
  }
}
