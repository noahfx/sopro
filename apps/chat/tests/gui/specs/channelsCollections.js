var societyProChat = function () {
  this.channelsCollection = element.all(by.repeater('channel in channels'));
  this.overflowChannelsCollection = element.all(by.repeater('channelOverflow in channels'));
  this.moreChannels = element(by.css('.sopro-more-channels'));
  this.currentRole = element(by.css(".role-selection"));
  this.roles = element.all(by.repeater('role in roles'));
  this.channelsContainer = element(by.css("#sopro-channel-wrap"));
  this.channelsTitles = element.all(by.css('.sopro-channel-title'));
  this.collectionTitleChannels = element(by.css('#collection-title-channels'));
}

describe('Channels list', function() {
  browser.get('http://localhost:8080/');
  var chat = new societyProChat();
  it('has a list of channels', function() {
    chat.currentRole.click();
    chat.roles.get(0).click();
    expect(chat.channelsCollection.count()).toEqual(2);
  });

  it('has a "Channels" channel collection title with a squared-off cartoon speech bubble conversation icon',
  function(){
    var title = chat.collectionTitleChannels;
    expect(title.isDisplayed()).toBeTruthy();
    expect(title.element(by.css('span')).getText()).toEqual('CHANNELS');
    var icon = title.element(by.css('img'));
    expect(icon.isDisplayed()).toBeTruthy();
    expect(icon.getAttribute('src')).toMatch(/icon-channels-channel.png$/);
  })

  it('has margin: 20px 16px', function(){
    var top = chat.channelsContainer.getCssValue('padding-top');
    var bottom = chat.channelsContainer.getCssValue('padding-bottom');
    var left = chat.channelsTitles.first().getCssValue('padding-left');
    var right = chat.channelsTitles.first().getCssValue('padding-right');
    expect(top).toBe('20px');
    expect(bottom).toBe('20px');
    expect(left).toBe('16px');
    expect(right).toBe('16px');
  })

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