module.exports = CAM_CONFIG_SERVERS = {
  server: {
    host: 'localhost',
    port: 8080,
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