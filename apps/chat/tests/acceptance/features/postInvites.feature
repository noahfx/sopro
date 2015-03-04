Feature: POST channel invites via API
  As a Society Pro user
  I want to be able to create channel invitations via http POST
  So that I can use and/or develop rich messaging applications

  Scenario: sending channel invitations via API
    Given I have a valid authentication token
      And a specified role is a subscriber to a channel
      And I have a peer who is not a channel subscriber
    When I make the correct POST request with that channels id, that peer's id, and role id
    Then a channel join invitation should be sent for that peer ID

  Scenario: channel invitations via API to subscribed peers
    Given I have a valid authentication token
      And a specified role is a subscriber to a channel
      And I have a peer who is a channel subscriber
    When I make the correct POST request with that channels id, that peer's id, and role id
    Then a channel join invitation should not be sent for that peer ID
      And the response should indicate the peer is already a subscriber

  Scenario: channel invitations via API to a channel not subscribed to
    Given I have a valid authentication token
      And a specified role is not a subscriber to a channel
      And I have a peer
    When I make the correct POST request with that channels id, that peer's id, and role id
    Then a channel join invitation should not be sent for that peer ID
      And the response should indicate the role is not a channel subscriber