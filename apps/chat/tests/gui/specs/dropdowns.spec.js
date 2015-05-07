var CAM_MOCKS = require('../../common/mock-data.js');
var changeIdentity = require('../../common/protractor-helpers.js')(browser,element).changeIdentity;

var Elements = function () {
  this.toolbar = element(by.css("#logo-loco"));
  this.currentRole = element(by.css(".role-selection"));
  this.roles = element.all(by.repeater('role in roles'));
  this.collectionChannelsItems = element.all(by.css('#collection-channels .channel-item'));
  this.subscribersDropdown = element(by.css('sopro-subscribers-dropdown'));
  this.subscribersDropdownTitle = element(by.css("sopro-subscribers-dropdown .sopro-dropdown-title p"))
  this.collectionsOverflow = element(by.css('sopro-collections-dropdown'));
  this.collectionsOverflowWrap = element(by.css('sopro-collections-dropdown .sopro-dropdown-collection-wrap'));
  this.collectionsOverflowTitle = element(by.css('sopro-collections-dropdown .sopro-dropdown-title'))
  this.collectionsOverflowItems = element.all(by.css('sopro-collections-dropdown .dropdown-item'));
  this.collectionChannelsMore = element(by.css('#collection-channels .sopro-more-channels'));
  this.collectionPeersMore = element(by.css('#collection-peers .sopro-more-channels'));
  this.collectionsContainer = element(by.css("#sopro-collections-wrap"));
  this.channelsTitles = element.all(by.css('.sopro-collection-title'));
  this.collectionTitleChannels = element(by.css('#collection-channels .sopro-collection-title'));
  this.pooCollections1 = this.collectionChannelsMore;
  this.pooCollections2 = this.collectionPeersMore;
  this.pooSubscribers1 = element(by.css('sopro-collections-dropdown .dropdown-item:first-child'));
}

describe('Dropdowns', function(){
  browser.get('/');
  changeIdentity(0);
  var els = new Elements();
  var cpHeight = null;
  var cpTop = null;
  var cpBottom = null;
  beforeAll(function(){
    changeIdentity(1);
    els.collectionsContainer.getSize()
    .then(function(size){
      cpHeight = size.height;
      els.collectionsContainer.getLocation()
      .then(function(loc){
        cpTop = loc.y;
        cpBottom = loc.y + size.height;
      })
    })
  })
  describe('Collections: Channels Overflow', function(){
    it("opens an overflow with all the channels listed", function () {
      expect(els.collectionChannelsItems.count())
        .toEqual(CAM_MOCKS.displayedChannelCount);
      expect(els.collectionChannelsMore.isDisplayed())
        .toBeTruthy();
      els.collectionChannelsMore.click();
      expect(els.collectionsOverflowItems.count())
        .toEqual(CAM_MOCKS.getChannelsResponse2.channels.length);
    });

    it('highlights the POO element', function(){
      expect(els.collectionChannelsItems.get(0).getCssValue("background-color")).toEqual("rgba(0, 0, 0, 0)");
      browser.actions().
      mouseMove(els.collectionChannelsItems.get(0)).
      perform();
      expect(els.collectionChannelsItems.get(0).getCssValue("background-color")).toEqual("rgba(50, 50, 50, 1)");
    })
  })

  describe("dropdown keylines", function () {
    it("has a 20px margin", function () {
      els.collectionChannelsMore.click();
      expect(els.collectionsOverflowWrap.getCssValue("padding-top")).toEqual("20px");
      expect(els.collectionsOverflowWrap.getCssValue("padding-bottom")).toEqual("20px");
      expect(els.collectionsOverflowWrap.getCssValue("padding-right")).toEqual("20px");
      expect(els.collectionsOverflowWrap.getCssValue("padding-left")).toEqual("20px");
    });

    it("has a 20px tall title", function () {
      els.collectionChannelsMore.click();
      expect(els.collectionsOverflowTitle.getCssValue("height")).toEqual("20px");
    });

    it("has items 30px tall", function () {
      els.collectionChannelsMore.click();
      expect(els.collectionsOverflowItems.get(0).getCssValue("height")).toEqual("30px");
    })
  });

  describe('Dropdown heights', function(){
    it('Few elements: Dropdown shrinks to fit', function(){
      changeIdentity(1);
      els.collectionChannelsMore.click();
      els.collectionsOverflowItems.count()
      .then(function (count) {
        var expectedHeight = (count * 30 + 60) + "px";
        expect(els.collectionsOverflowWrap.getCssValue("height")).toEqual(expectedHeight); 
      });
    })

    it('Many elements: Dropdown is shorter than comm panel', function(){
      changeIdentity(0);
      els.collectionPeersMore.click();
      var expectedHeight = (cpHeight - 40) + "px";
      expect(els.collectionsOverflow.getCssValue("height")).toEqual(expectedHeight);
      changeIdentity(1);
    })
  })

  describe('Dropdown position', function(){

    describe('Short dropdown', function(){

      var pooTop;
      var pooBottom;

      var dropdownTop;
      var dropdownBottom;

      beforeAll(function(done){
        var POO1 = els.pooCollections1;

        POO1.click()
        .then(function(){

          POO1.getLocation()
          .then(function(loc){
            pooTop = loc.y;
            POO1.getSize()
            .then(function(size){
              pooBottom = loc.y + size.height;

              els.collectionsOverflowWrap.getSize()
              .then(function(size2){
                els.collectionsOverflowWrap.getLocation()
                .then(function(loc2){
                  dropdownTop = loc2.y
                  dropdownBottom = loc2.y + size2.height;

                  done();
                })
              })
            })
          })
        });
      })

      describe('in screen middle', function(){
        it('Top of dropdown is aligned with top of POO element', function(){
          expect(dropdownTop - pooTop).toBe(1);
        });
        it('Extends mostly down from POO', function(){
          expect(dropdownBottom - pooBottom).toBeGreaterThan(0);
        });
        xit('does not have a scrollbar', function(){
          expect(scrollbar.isDisplayed()).toBeFalsy()
        })
        it('Extends no further up than 20px below the comm panel top', function(){
          expect(dropdownTop - cpTop).not.toBeLessThan(20);
        });
        it('Extends no further down than 20px above the comm panel bottom', function(){
          expect(cpBottom - dropdownBottom).not.toBeLessThan(20);
        });
      })

    });

    describe('Tall dropdown', function(){

      var pooTop;
      var pooBottom;

      var dropdownTop;
      var dropdownBottom;

      beforeAll(function(done){
        var POO2 = els.pooCollections2;
        changeIdentity(0);
        POO2.click()
        .then(function(){

          POO2.getLocation()
          .then(function(loc){
            pooTop = loc.y;
            POO2.getSize()
            .then(function(size){
              pooBottom = loc.y + size.height;

              els.collectionsOverflow.getSize()
              .then(function(size2){
                els.collectionsOverflow.getLocation()
                .then(function(loc2){
                  dropdownTop = loc2.y
                  dropdownBottom = loc2.y + size2.height;

                  done();
                })
              })
            })
          })
        });
      })

      it('Extends no further up than 20px below the comm panel top', function(){
        expect(dropdownTop - cpTop).not.toBeLessThan(20);
      });

      it('Extends no further down than 20px above the comm panel bottom', function(){
        console.log(require('util').format('cpBottom: %s dropdownBottom: %s', cpBottom, dropdownBottom))
        expect(cpBottom - dropdownBottom).not.toBeLessThan(20);
      });

      xit('has a scrollbar', function(){
        //expect(scrollbar.isDisplayed()).toBeTruthy()
      });
    });
  })

  describe('Dropdown animations', function(){
    xit('Opening dropdown: Animates out from POO', function(){

    })
    xit('Closing dropdown: Animates back to POO', function(){

    })
  })

})