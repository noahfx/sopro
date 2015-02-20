var societyProChat = function () {
  this.channelsCollection = element.all(by.repeater('channel in channels'));
}

describe('Channels list', function() {
  browser.get('localhost:8080/');
  var chat = new societyProChat();
  it('has a list of channels', function() {
    expect(chat.channelsCollection.size()).toBeEqual(2);
  });  
});