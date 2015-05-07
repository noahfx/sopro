var CAM_MOCKS = require('../../common/mock-data.js');
var changeIdentity = require('../../common/protractor-helpers.js')(browser,element).changeIdentity;

describe("Main Stage",function  () {
  browser.get('/');
  changeIdentity(0);
  describe("Open an existing channel", function(){
    it("finds the 'random' channel", function(){
      changeIdentity(0);
      expect(
        element.all(by.css('#collection-channels .channel-item'))
        .get(1)
        .getText()
      ).toMatch(/random/i)
    })

    it("opens a history card when you single click the POO", function(done){
      element.all(by.css('#collection-channels .channel-item'))
      .get(1)
      .click();
      setTimeout(function(){
        expect(
          element.all(by.css('#main-stage .channel-card'))
          .count()
        ).toBe(1);
        done();
      }, 2000)
    })

    it("contains a list of messages", function(){
      expect(
        element.all(by.css('#message-'))
        .count(0)
      ).toBeGreaterThan(0);
    })

    xit("closes when you click the X", function(){
      element.all(by.css('#main-stage > ng-include > md-card > header > span.x-button'))
      .get(0)
      .click();

      expect(
        element.all(by.css('#main-stage .channel-card'))
        .count()
      ).toBe(0);
    })
  })

  describe("Create a new channel", function () {

    var els = {
      collectionTitleChannels: element(by.css('#collection-channels .sopro-collection-title')),
      addChannelButtons: element.all(by.css(".channel-create-link")),
      createChannelCard: element(by.css("#card-create-channel")),
      createChannelCardX: element(by.css("#card-create-channel header .x-button")),
      createChannelCardHeader: element(by.css("#card-create-channel header .title")),
      createChannelCardTitle: element(by.css("#card-create-channel .card-content .title")),
      createChannelCardDesc: element(by.css("#card-create-channel .card-content .channel-description")),
      createChannelCardCancel: element(by.css("#card-create-channel footer .cancel-button")),
      createChannelCardCreate: element(by.css("#card-create-channel footer .create-button")),
      channelHistoryCards: element.all(by.css("#main-stage .sopro-card.channel-card")),
      titleCard: element(by.css("#member-name > strong"))
    };

    describe("Channel Creation Card", function () {
      var addChannelButton = els.addChannelButtons.first();
      it("displays when you click Add Channel", function(){

        browser.actions()
        .mouseMove(
          element(by.css('#collection-channels .sopro-collection-title'))
        )
        .perform();

        addChannelButton.click();
        expect(els.createChannelCard.isDisplayed()).toBeTruthy();
      });

      it("has the required elements", function(){

        expect(els.createChannelCardHeader.isDisplayed()).toBeTruthy();
        expect(els.createChannelCardHeader.getText()).toEqual("Create a channel");

        expect(els.createChannelCardX.isDisplayed()).toBeTruthy();
        expect(els.createChannelCardTitle.isDisplayed()).toBeTruthy();
        expect(els.createChannelCardDesc.isDisplayed()).toBeTruthy();
        expect(els.createChannelCardCancel.isDisplayed()).toBeTruthy();
        expect(els.createChannelCardCreate.isDisplayed()).toBeTruthy();

      });
    });

    describe("Channel History Card", function () {
      var addChannelButton = els.addChannelButtons.first();
      it("replaces the Channel Creation Card", function(){
        els.createChannelCardTitle.sendKeys(CAM_MOCKS.newChannelName);
        els.createChannelCardCreate.click();
        expect(els.channelHistoryCards.count()).toBe(0);
        expect(els.createChannelCard.isDisplayed()).toBeFalsy();
      });
      it("has the correct title", function(){
        expect(els.titleCard.getText()).toEqual(CAM_MOCKS.newChannelName);
      });
    });
  });
});