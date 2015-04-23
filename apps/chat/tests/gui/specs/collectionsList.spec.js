var CAM_MOCKS = require('../../common/mock-data.js');
var changeIdentity = require('../../common/protractor-helpers.js')(browser,element).changeIdentity;

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

      describe('Add Channel link', function(){
        it('exists', function(){
          expect(
            element(by.css('.channel-create-link'))
            .isDisplayed()
          ).toBeTruthy();
        });

        it('has low opacity without hover', function(){
          expect(
            element(by.css('.channel-create-link'))
            .getCssValue('opacity')
          ).toMatch(/^0\.1/);
          // .toBe('0.1') doesn't work due to the transition: "Expected '0.100000001490116' to be '0.1'."
        });

        it('has high opacity after hover', function(done){
          browser.actions()
          .mouseMove(
            element(by.css('#collection-channels .sopro-collection-title'))
          )
          .perform();

          // Wait for the opacity to fade in:
          setTimeout(function(){
            expect(
              element(by.css('.channel-create-link'))
              .getCssValue('opacity')
            ).toBe('1');
            done();
          }, 1100)
        });
      })

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
        it('displays a channel name', function(){
          expect(first.getText()).not.toEqual("");
        });
        it('has gray text', function(){
          expect(first.getCssValue('color')).toEqual('rgba(175, 175, 175, 1)');
        });
        it('is the expected height', function(){
          expect(first.getCssValue('height')).toEqual('25px');
        });
        describe('on hover - ', function(){
          beforeEach(function(){
            browser.actions()
            .mouseMove(
              element.all(by.css('#collection-channels .channel-item')).first()
            )
            .perform();
          });

          it('has gray text and gray background', function(){
            expect(first.getCssValue('color')).toEqual('rgba(175, 175, 175, 1)');
            expect(first.getCssValue('background-color')).toEqual('rgba(50, 50, 50, 1)');
          });
        })
      })

    });

    describe('"Peers" channel collection - ', function(){

    });

  })

});