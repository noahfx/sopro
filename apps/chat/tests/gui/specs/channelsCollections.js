var societyProChat = function () {
  this.channelsCollection = element.all(by.repeater('channel in channels'));
  this.overflowChannelsCollection = element.all(by.repeater('channelOverflow in channels'));
  this.moreChannels = element(by.css('.sopro-more-channels'));
  this.currentRole = element(by.css(".role-selection"));
  this.roles = element.all(by.repeater('role in roles'));
}

describe('Channels list', function() {
  browser.get('http://localhost:8080/');
  var chat = new societyProChat();
  it('has a list of channels', function() {
    chat.currentRole.click();
    chat.roles.get(0).click();
    expect(chat.channelsCollection.count()).toEqual(2);
  }); 

  describe("Overflow channels collection", function () {
    it("appears a more... button to open the overflow when the channels list exceed the max value to show", function () {
      chat.currentRole.click();
      chat.roles.get(1).click();
      expect(chat.channelsCollection.count()).toEqual(2);
      expect(chat.moreChannels.isDisplayed()).toBeTruthy();
      expect(chat.moreChannels.getText()).toEqual("+1 more...");
    });
    it("open an overflow with all the channels listed", function () {
      chat.currentRole.click();
      chat.roles.get(1).click();
      expect(chat.channelsCollection.count()).toEqual(2);
      expect(chat.moreChannels.isDisplayed()).toBeTruthy();
      chat.moreChannels.click();
      expect(chat.overflowChannelsCollection.count()).toEqual(3);
    });
  });
});