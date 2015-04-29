Feature: GET messages via API
  As a Society Pro user
  I want to receive a list of my messages via API
  So that I can use and/or develop rich applications

  Scenario: messages via API GET
    Given I have a valid authentication token for GET /api/channels.history
      And my identity is a member of a given channel
    When I make the correct GET request to the API with that channel name and the auth token
    Then the response should contain a list of chat messages from that channel
      And the response should contain a metadata object for that channel
