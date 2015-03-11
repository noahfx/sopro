var CAM_MOCKS = require('../../mock-data.js');

var Elements = function () {
  this.currentRole = element(by.css(".role-selection"));
  this.roles = element.all(by.repeater('role in roles'));

  this.channelCollections = element.all(by.css('.channel-collection'));
  this.channelsChannels = element.all(by.css('#collection-channels .channel-item'));
  this.collectionChannelsOverflow = element.all(by.css('#collection-channels .overflow-item'));
  this.collectionChannelsMore = element(by.css('#collection-channels .sopro-more-channels'));
  this.pooCollections1 = this.collectionChannelsMore;
  this.collectionChannelsContainer = element.all(by.css("collection"));
  this.channelsContainer = element(by.css("#sopro-channel-wrap"));
  this.channelsTitles = element.all(by.css('.sopro-channel-title'));
  this.collectionTitleChannels = element(by.css('#collection-channels .sopro-channel-title'));
  this.pooCollections2 = element(by.css('#collection-peers .sopro-more-channels'));
  this.pooSubscribers1 = element(by.css('sopro-collections-dropdown .dropdown-item:first-child'));
}

describe('Dropdowns', function(){
  browser.get('http://localhost:8080/');
  var els = new Elements();
  describe('Collections: Channels Overflow', function(){
    beforeAll(function(){
        els.currentRole.click();
        els.roles.get(1).click();
    })

    it("opens an overflow with all the channels listed", function () {
      expect(els.channelsChannels.count())
        .toEqual(CAM_MOCKS.displayedChannelCount);
      expect(els.collectionChannelsMore.isDisplayed())
        .toBeTruthy();
      els.collectionChannelsMore.click();
      expect(els.collectionChannelsOverflow.count())
        .toEqual(CAM_MOCKS.getChannelsResponse2.channels.length);
    });

    xit('highlights the POO element', function(){

    })
  })

  describe('Dropdown heights', function(){
    xit('Few elements: Dropdown shrinks to fit', function(){
      //expect(dropdownHeight - dropdownElementsHeight).toBe(x);
      //expect(scrollbar.isDisplayed()).toBeFalsy()
    })

    xit('Many elements: Dropdown is shorter than parent container', function(){
      //expect(parentHeight-dropdownHeight).toBe(40);
      //expect(scrollbar.isDisplayed()).toBeTruthy()
    })
  })

  describe('Dropdown position', function(){
    describe('Short dropdown in screen middle', function(){
      var POO1y;
      var pxAbove;
      var pxBelow;
      var els;

      beforeAll(function(done){
        els = new Elements();
        els.currentRole.click();
        els.roles.get(1).click();
        els.pooCollections1.click();

        var POO1 = els.pooCollections1;
        //var POO2 = els.pooCollections2;
        //var POO3 = els.pooSubscribers1;

        POO1.getLocation()
        .then(function(loc){
          POO1y = loc.y;
        })

        //pxAbove =  - dropdownTop;
        //pxBelow = dropdownBottom - POOtop;
      })
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