var CAM_MOCKS = require('../../mock-data.js');

var Elements = function () {
  this.currentRole = element(by.css(".role-selection"));
  this.roles = element.all(by.repeater('role in roles'));
  this.collectionChannelsItems = element.all(by.css('#collection-channels .channel-item'));
  this.collectionsOverflow = element(by.css('sopro-collections-dropdown .sopro-dropdown-collection-wrap'));
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
  browser.get('http://localhost:8080/');
  var els = new Elements();
  var cpHeight = null;
  beforeAll(function(){
    els.currentRole.click();
    els.roles.get(1).click();
    els.collectionsContainer.getSize()
    .then(function(size){
      cpHeight = size.height;
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
      expect(els.collectionChannelsItems.get(0).getCssValue("background-color")).toEqual("rgba(131, 131, 131, 1)");
    })
  })

  describe("dropdown keylines", function () {
    it("has a 20px margin", function () {
      els.collectionChannelsMore.click();
      expect(els.collectionsOverflow.getCssValue("padding-top")).toEqual("20px");
      expect(els.collectionsOverflow.getCssValue("padding-bottom")).toEqual("20px");
      expect(els.collectionsOverflow.getCssValue("padding-right")).toEqual("20px");
      expect(els.collectionsOverflow.getCssValue("padding-left")).toEqual("20px");
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
      els.collectionChannelsMore.click();
      els.collectionsOverflowItems.count()
      .then(function (count) {
        var expectedHeight = (count * 30 + 60) + "px";
        expect(els.collectionsOverflow.getCssValue("height")).toEqual(expectedHeight); 
      });
    })

    it('Many elements: Dropdown is shorter than parent container', function(){
      els.currentRole.click();
      els.roles.get(0).click();
      els.collectionPeersMore.click();
      var expectedHeight = (cpHeight - 40) + "px";
      expect(els.collectionsOverflow.getCssValue("height")).toEqual(expectedHeight);
      els.currentRole.click();
      els.roles.get(1).click();
    })
  })

  describe('Dropdown position', function(){
    var POOtop;
    var POObottom;
    beforeAll(function(done){
      els.currentRole.click();
      els.roles.get(1).click();

      var POO1 = els.pooCollections1;
      //var POO2 = els.pooCollections2;
      //var POO3 = els.pooSubscribers1;

      POO1.getLocation()
      .then(function(loc){
        POO1y = loc.y;
      })
    });
    describe('Short dropdown in screen middle', function(){

      var dropdownTop;
      var dropdownBottom;

      beforeAll(function () {
        els.pooCollections1.click();
      });

      //pxAbove =  - dropdownTop;
      //pxBelow = dropdownBottom - POOtop;
      xit('Top of dropdown is aligned with top of POO element', function(){
        expect(pxAbove).toBe(0);
      });
      xit('Extends mostly down from POO', function(){
        expect(pxBelow).toBeGreaterThan(0);
      });
      xit('does not have a scrollbar', function(){
        //expect(scrollbar.isDisplayed()).toBeFalsy()
      })
    });

    describe('Short dropdown at screen bottom', function(){
      xit('Extends no further than 20px before the comm panel bottom', function(){

      });
      xit('Extends further toward the top of screen', function(){

      });
      xit('does not have a scrollbar', function(){
        //expect(scrollbar.isDisplayed()).toBeFalsy()
      });
    });

    describe('Short dropdown at screen top', function(){
      xit('Extends no further than 20px before the comm panel top', function(){

      });
      xit('Extends further toward the bottom of screen', function(){

      });
      xit('does not have a scrollbar', function(){
        //expect(scrollbar.isDisplayed()).toBeFalsy()
      });
    });

    describe('Tall dropdown', function(){
      xit('Extends no further than 20px before the comm panel top', function(){

      });
      xit('Extends no further than 20px before the comm panel bottom', function(){

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