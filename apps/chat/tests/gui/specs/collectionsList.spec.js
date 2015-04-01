var CAM_MOCKS = require('../../mock-data.js');
var changeIdentity = require('../../protractorHelpers.js')(browser,element).changeIdentity;

var societyProChat = function () {
  this.channelCollections = element.all(by.css('.channel-collection'))
  this.collectionChannelsItems = element.all(by.css('#collection-channels .channel-item'));
  this.collectionChannelsMore = element(by.css('#collection-channels .sopro-more-channels'));
  this.collectionChannelsContainer = element.all(by.css("collection"));
  this.currentRole = element(by.css(".role-selection"));
  this.roles = element.all(by.repeater('role in roles'));
  this.collectionsContainer = element(by.css("#sopro-collections-wrap"));
  this.channelsTitles = element.all(by.css('.sopro-collection-title'));
  this.collectionTitleChannels = element(by.css('#collection-channels .sopro-collection-title'));
}

describe('Collections list', function() {
  browser.get('/');
  changeIdentity(0);
  var chat = new societyProChat();

  describe('Inline Channel Collections - ', function(){
    it('has a list of channel collections', function() {
      expect(chat.channelCollections.count()).toEqual(2);
    });

    describe('"Channels" channel collection - ', function(){
      it('goes to the first role', function(){
        changeIdentity(0);
      });
      it('has text "CHANNELS"', function(){
        var title = chat.collectionTitleChannels;
        expect(title.isDisplayed()).toBeTruthy();
        expect(title.element(by.css('span')).getText()).toEqual('CHANNELS');
      });

      it('has a Add Channel link', function(){
        expect(
          element(by.css('.channel-create-link'))
          .isPresent()
        ).toBeFalsy();
        browser.actions()
            .mouseMove(chat.collectionTitleChannels)
            .perform();
        expect(
          element(by.css('.channel-create-link'))
          .isDisplayed()
        ).toBeTruthy();

      });

      it('contains a list of channels', function(){
        expect(chat.collectionChannelsItems.count()).toBeGreaterThan(0);
      });


      it('has a "+X more..." button if there are more channels than the limit', function () {
        changeIdentity(1);
        expect(chat.collectionChannelsItems.count()).toEqual(CAM_MOCKS.displayedChannelCount);
        expect(chat.collectionChannelsMore.isDisplayed()).toBeTruthy();
        var n = CAM_MOCKS.getChannelsResponse2.channels.length - CAM_MOCKS.displayedChannelCount;
        var regex = /^\+[\d]+ more\.\.\.$/
        expect(chat.collectionChannelsMore.getText()).toMatch(regex)
      });

      it('does not have a "+X more..." button if there are fewer channels than the limit', function(){
        changeIdentity(0);
        expect(chat.collectionChannelsMore.isDisplayed()).toBeFalsy();
      });


      describe('the first channel - ', function(){
        var first = chat.collectionChannelsItems.first();
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
            expect(first.getCssValue('color')).toEqual('rgba(85, 84, 89, 1)');
            expect(first.getCssValue('background-color')).toEqual('rgba(0, 0, 0, 0.0470588)');
          });
        })
      })

    });

    describe('"Peers" channel collection - ', function(){

    });

  })

});