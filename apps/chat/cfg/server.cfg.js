module.exports = CAM_CONFIG_SERVERS = {
  server: {
    host: 'localhost',
    port: 8080,
  },
  couchdb: {
    host: 'localhost',
    port: 5984,
  },
  vertx: {
    host: 'localhost',
    port: 3333,
    prefix: '/eventbus',
    eburl: 'http://localhost:3333/eventbus'
  }
}