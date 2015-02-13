/**
 * Incoming Message Queueing 
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  init: function () {
	var vertx = require('vertx-eventbus-client');
	//var vertx = require('../index.js');
	var eb = this.eb = new vertx.EventBus('http://localhost:8080/eventbus');

	eb.onopen = function () {
		//console.log("Waiting for messages..");
		eb.registerHandler('new_message', IMessageQueue.incomingMessageHandler);	

		eb.send("new_message","Mensaje random");
	}
  },

  incomingMessageHandler : function (message) {
  	//console.log('Message received');
    //console.log(message);
    //console.log("Parsing Message");
  }
};
