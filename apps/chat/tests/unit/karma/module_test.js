'use strict';

describe("Module societyProChatApp App", function () {
  var module;
  
  beforeEach(function() {
    module = angular.module("societyProChatApp");
  });

  beforeEach(angular.mock.module("societyProChatApp"));

  it("is registered", function() {
    expect(module).not.toEqual(null);
  });

  describe("Dependencies", function() {
    var deps;
    var hasModule = function(m) {
      return deps.indexOf(m) >= 0;
    };
    beforeEach(function() {
      deps = module.requires;
    });

    it("has controllers module as a dependency", function() {
      expect(hasModule('societyProChatApp.controllers')).toEqual(true);
    });
  });
});