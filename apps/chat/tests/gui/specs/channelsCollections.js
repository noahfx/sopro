var societyProChat = function () {
  this.channelsCollection = element.all(by.repeater('channel in channels'));
  this.currentRole = elemtent(by.css());
}

describe('Channels list', function() {
  browser.get('http://localhost:8080/');
  var chat = new societyProChat();
  it('has a list of channels', function() {
    expect(chat.channelsCollection.count()).toEqual(2);
  }); 

  describe("Overflow channels collection", function () {

  });
});