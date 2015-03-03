var CAM_MOCKS = require('../../mock-data.js');

var societyProChat = function () {
  this.channelCollections = element.all(by.css('.channel-collection'))
  this.channelsChannels = element.all(by.css('#collection-channels .channel-item'));
  this.collectionChannelsOverflow = element.all(by.css('#collection-channels .overflow-item'));
  this.collectionChannelsMore = element(by.css('#collection-channels .sopro-more-channels'));
  this.collectionChannelsContainer = element.all(by.css("collection"));
  this.currentRole = element(by.css(".role-selection"));
  this.roles = element.all(by.repeater('role in roles'));
  this.channelsContainer = element(by.css("#sopro-channel-wrap"));
  this.channelsTitles = element.all(by.css('.sopro-channel-title'));
  this.collectionTitleChannels = element(by.css('#collection-channels .sopro-channel-title'));
}

describe('Collections list', function() {
  browser.get('http://localhost:8080/');
  var chat = new societyProChat();

  it('has margin: 20px 16px', function(){
    var top = chat.collectionChannelsContainer.get(0).getCssValue('margin-top');
    var bottom = chat.channelsContainer.getCssValue('padding-bottom');
    var left = chat.channelsTitles.first().getCssValue('padding-left');
    var right = chat.channelsTitles.first().getCssValue('padding-right');
    expect(top).toBe('20px');
    expect(bottom).toBe('20px');
    expect(left).toBe('16px');
    expect(right).toBe('16px');
  })

  describe('Inline Channel Collections - ', function(){
    it('has a list of channel collections', function() {
      expect(chat.channelCollections.count()).toEqual(2);
    });

    describe('"Channels" channel collection - ', function(){
      it('goes to the first role', function(){
        chat.currentRole.click();
        chat.roles.get(0).click();
      });
      it('has text "CHANNELS"', function(){
        var title = chat.collectionTitleChannels;
        expect(title.isDisplayed()).toBeTruthy();
        expect(title.element(by.css('span')).getText()).toEqual('CHANNELS');
      });
      it('has a squared-off cartoon speech bubble conversation icon', function(){
        var title = chat.collectionTitleChannels;
        var icon = title.element(by.css('img'));
        expect(icon.isDisplayed()).toBeTruthy();
        expect(icon.getAttribute('src')).toMatch(/icon-channels.png$/);
      });

      it('has a Add Channel link', function(){
        expect(
          element(by.css('#collection-channels .collection-create-link'))
          .isDisplayed()
        ).toBeTruthy();

      });

      it('contains a list of channels', function(){
        expect(chat.channelsChannels.count()).toBeGreaterThan(0);
      });

      describe('the first channel - ', function(){
        var first = chat.channelsChannels.first();
        it('has text "random"', function(){
          expect(first.getText()).toEqual('random');
        });
        it('has gray text', function(){
          expect(first.getCssValue('color')).toEqual('rgba(85, 84, 89, 1)');
          //expect(first.getCssValue('background-color')).toEqual('rgba(255, 255, 255, 1)');
        });
        it('is the expected height', function(){
          expect(first.getCssValue('height')).toEqual('32px');
        });
        describe('on hover - ', function(){
          beforeEach(function(){
            browser.actions()
            .mouseMove(browser.findElement(by.css('#collection-channels .channel-item')))
            .perform();

          })

          it('has light gray text and gray background', function(){
            expect(first.getCssValue('color')).toEqual('rgba(204, 204, 204, 1)');
            expect(first.getCssValue('background-color')).toEqual('rgba(131, 131, 131, 1)');
          });
        })
      })

      describe('channels collection Overflow - ', function () {
        it('has a "+X more..." button if there are more channels than the limit', function () {
          chat.currentRole.click();
          chat.roles.get(1).click();
          expect(chat.channelsChannels.count()).toEqual(CAM_MOCKS.displayedChannelCount);
          expect(chat.collectionChannelsMore.isDisplayed()).toBeTruthy();
          expect(chat.collectionChannelsMore.getText()).toEqual("+1 more...");
        });

        xit('does not have a "+X more..." button if there are fewer channels than the limit', function(){

        });

        it("open an overflow with all the channels listed", function () {
          chat.currentRole.click();
          chat.roles.get(1).click();
          expect(chat.channelsChannels.count())
            .toEqual(CAM_MOCKS.displayedChannelCount);
          expect(chat.collectionChannelsMore.isDisplayed())
            .toBeTruthy();
          chat.collectionChannelsMore.click();
          expect(chat.collectionChannelsOverflow.count())
            .toEqual(CAM_MOCKS.getChannelsResponse2.channels.length);
        });
      });

    });

    xdescribe('"Peers" channel collection - ', function(){

    });
  })

});