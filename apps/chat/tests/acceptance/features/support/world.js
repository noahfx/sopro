// features/support/world.js
module.exports = function() {
  
  //zombie.localhost('localhost', 8080);
  this.World = function World(callback) {
    //this.browser = new zombie(); // this.browser will be available in step definitions

    callback(); // tell Cucumber we're finished and to use 'this' as the world instance
  };
}