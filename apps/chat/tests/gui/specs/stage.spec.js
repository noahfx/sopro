var changeIndentity = require('../../protractorLogin.js')(browser,element).changeIndentity;

describe("Main Stage",function  () {
  browser.get('/');
  changeIndentity(0);
  describe("Create a new channel", function () {

    var els = {
      addChannelButton: element(by.css("#collection-channels-create")),
      createChannelCard: element(by.css("#card-create-channel")),
      createChannelCardX: element(by.css("#card-create-channel header .x-button")),
      createChannelCardHeader: element(by.css("#card-create-channel header .title")),
      createChannelCardTitle: element(by.css("#card-create-channel .card-content .title")),
      createChannelCardDesc: element(by.css("#card-create-channel .card-content .channel-description")),
      createChannelCardCancel: element(by.css("#card-create-channel footer .cancel-button")),
      createChannelCardCreate: element(by.css("#card-create-channel footer .create-button")),
      channelHistoryCards: element.all(by.css("#main-stage .sopro-card.channel-card")),
    };

    describe("Channel Creation Card", function () {
      it("displays when you click Add Channel", function(){
        els.addChannelButton.click();
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
      it("replaces the Channel Creation Card", function(){
        els.createChannelCardTitle.sendKeys(CAM_MOCKS.newChannelName);
        els.createChannelCardCreate.click();
        expect(els.channelHistoryCards.count()).toBe(1);
        expect(els.createChannelCard.isPresent()).toBeFalsy();
      });
      it("has the correct title", function(){
        expect(
          els.channelHistoryCards.get(0)
          .element(by.css('header .title'))
          .getText()
        ).toEqual(CAM_MOCKS.newChannelName)
      })

    });

  });

});