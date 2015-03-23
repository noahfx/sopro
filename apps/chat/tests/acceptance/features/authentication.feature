Feature: Society Pro Authentication
  As a Society Pro enterprise edition administrator
  I want to be able to authenticate users using a local database of users
  So that name and password management are centralized within Society Pro

  Scenario: authenticating with the Society Pro database
    Given I have not configured Society Pro to use an authentication application
    When I connect to the Society Pro server
    Then the session is authenticated against a Society Pro database of user credentials