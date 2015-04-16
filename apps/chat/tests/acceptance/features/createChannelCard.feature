Feature: Create a new channel card
  As a Society Pro user
  I want to be able to create new channels
  So that I can include multiple peers in a conversation

  Scenario: opening the channel creation card
    Given I am using the chatlog application as foobar
    When I select "+ Add Channel"
    Then I should see a channel creation card
      And the card should be in the number 1 position on the main stage

  Scenario: closing open create/add cards when "+ add a channel" is clicked
      And there is an open "create channel" card on the main stage
    When I select "+ Add Channel"
    Then I should see a blank channel creation card

  Scenario: submiting the create channel form
    Given there is an open "create channel" card on the main stage
    When I enter a name for the channel
      And I click the "Create Channel" button
    Then I should not see a channel creation card
      And a channel should be created from the creation card

  Scenario: cancelling the create channel form with the cancel button
    Given there is an open "create channel" card on the main stage
    When I click the "cancel" button
    Then I should not see a channel creation card
      And I should not see a channel card for that channel

  Scenario: cancelling the create channel form with the "X" icon button
    Given there is an open "create channel" card on the main stage
    When I click the "X" icon button
    Then I should not see a channel creation card
      And I should not see a channel card for that channel
