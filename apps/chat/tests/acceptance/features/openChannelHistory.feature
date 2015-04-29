Feature: Open the Channel History
  As a Society Pro user
  I want to be able to open channel history cards on the main stage
  So that I can view the timeline of events and messages in that channel

  Scenario: opening a channel history with a click
    Given I am viewing a list of channels
    When I click on a channel item
    Then I should see the channel history displayed on the main stage
