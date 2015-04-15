Feature: Persistent Channels
  As a Society Pro user
  I want the channels I create to be permanent
  So that I can send and receive messages from them

  Scenario: persisting a new channel
    Given I have a valid authentication token
      And I am authorized to create a channel
      And a given channel name does not exist
    When I POST that channel name
    Then that channel is persisted

  Scenario: persisting an existing channel
    Given I have a valid authentication token
      And I am authorized to create a channel
      And a given channel name does exist
    When I POST that channel name
    Then that channel is not persisted
      And an error is returned