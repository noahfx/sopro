var expect = require('expect.js');
var sinon = require('sinon');
global.IMessageQueue = require('../../../../api/services/IMessageQueue.js');
var vertx = require('vertx-eventbus-client');

describe("IMessageQueue", function() {
	describe("init:", function() {
		var spy;
		before(function () {
			spy = sinon.spy(IMessageQueue, "init");
			IMessageQueue.init();
		});
	    it("opens a connection with vertx", function() {
	    	expect(spy.thisValues[0].eb).not.to.be(undefined);
	    });
	    /*it("handles the message received", function(done) {
	    	this.timeout(10000);
	    	var handlerStub = sinon.stub(IMessageQueue, "incomingMessageHandler", function (message) {
	    		expect(message).to.be('some message');
	    		done();
	    	});
	    });*/
	    after(function () {
	    	spy.restore();
	    });
  	});
});