module.exports = CAM_CONFIG_SERVERS = {
  express: {
    //host: 'localhost',
    bindAddress: '0.0.0.0',
    hostname: 'localhost',
    port: 8080,
    sslEnabled: true,
    sslPort: 443,
    sslOptions: {
      keyfile: 'cfg/ssl/192.168.10.206.key',
      certfile: 'cfg/ssl/192.168.10.206.crt',
      fingerprint: '1E:DE:9A:80:2D:98:51:D9:25:A5:F3:A4:3B:BD:89:21:7C:9D:DB:A2',
    },
    runtimeGroup: "ubuntu",
    runtimeUser: "ubuntu"
  },
  couchdb: {
    port: 5984,
    db: 'mocks',
    host: 'localhost',
    url: 'http://localhost:5984',
    //url: "https://admin:sopassword@sopro.iriscouch.com",
    //host: "sopro.iriscouch.com",
  },
  vertx: {
    host: 'localhost',
    port: 3333,
    prefix: '/eventbus',
    eburl: 'http://localhost:3333/eventbus'
  },
}