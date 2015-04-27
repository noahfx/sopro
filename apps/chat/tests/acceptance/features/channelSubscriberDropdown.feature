Feature: Channel subscriber dropdown
  As a Society Pro user
  I want to view a list of current channel subscribers
  So that I can verify the audience of my messages

  Scenario: subscriber dropdown button
    Given I am viewing a list of channels
    When I select a channel from the list
    Then I should see a list of channel subscribers