Feature: Create a new channel card
  As a Society Pro user
  I want to be able to create new channels
  So that I can include multiple peers in a conversation

  Scenario: opening the channel creation card
    Given I have started the chatlog application
      And I am viewing a list of channels
    When I select "+ Add Channel"
    Then I should see a channel creation card
      And the card should be in the number 1 position on the main stage

  Scenario: closing open create/add cards when "+ add a channel" is clicked
    Given I am viewing a list of channels
      And there is an open "create" card on the main stage
    When I select "+ Add Channel"
    Then the open "create" card should close

  Scenario: submiting the create channel form
    Given I am viewing the channel creation card
    When I enter a name for the channel
      And I click the "Create Channel" button
    Then the channel creation card should become a new channel history card
      And the new channel should be POSTed via the API

  Scenario: cancelling the create channel form with the cancel button
    Given I am viewing a channel creation card
    When I click the "cancel" button
    Then the channel creation card should close

  Scenario: cancelling the create channel form with the "X" icon button
    Given I am viewing a channel creation card
    When I click the "X" icon button
    Then the channel creation card should close