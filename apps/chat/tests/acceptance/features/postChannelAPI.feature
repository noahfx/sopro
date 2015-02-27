Feature: POST a new channel via API
  As a Society Pro user
  I want to be able to create channels via http POST
  So that I can use and/or develop rich messaging applications

  Scenario: creating channels via API
    Given I have a valid authentication token
    When I make the correct POST request to the API server
    Then a channel should be created for the role specified
      And a channel creation message should be placed on the event bus
      And the specified role should be subscribed to the channel