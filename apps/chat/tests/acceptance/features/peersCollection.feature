Feature: Peer channels
  As a Society Pro user
  I want to have channels for messages that only go to a specific peer
  So that I can I can conduct private conversations with that peer

  Scenario: listing peer channels
    Given a specific role has peers
    When I choose a role
    Then I should see a collection of peer channels