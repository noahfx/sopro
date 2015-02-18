Feature: GET channels via API
  As a Society Pro user
  I want to be able to receive a list of my channels via http GET
  So that I can use and/or develop rich messaging applications
  
  Scenario: listing channels via API
    Given I have a valid authentication token
    When I make the correct GET request to the API server with a role id
    Then the response should contain a list of channels for that role