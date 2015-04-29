Feature: Sending a chat message
  As a Society Pro user
  I want a record kept of my outgoing messages
  So that I see what I said

  Scenario: new message input
    Given I am viewing a list of channels
    When I open the channel history
    Then I should see a new message input at the bottom

  Scenario: sending a message from the GUI
    Given I have entered a message in the new message input
    When I press enter
    Then the message should be sent via the API