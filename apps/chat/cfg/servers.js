module.exports = CAM_CONFIG_SERVERS = {
  express: {
    host: 'localhost',
    port: 8080,
    sslPort: 443,
    sslOptions: {
      keyfile: 'cfg/ssl/192.168.10.206.key',
      certfile: 'cfg/ssl/192.168.10.206.crt',
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