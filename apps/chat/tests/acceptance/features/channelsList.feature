Feature: Channels list
  As a Society Pro user
  I want to see a list of channels to which my role is subscribed
  So that I can select which channel's history to show

  Scenario: viewing a list of channels
    Given I have started the chatlog application
    When I choose a role
    Then I should see a list of channels to which that role is subscribed

  Scenario: changing the list of channels on role change
    Given I have started the chatlog application
      And I choose a role
    When I choose a different role
    Then the list of channels for that role should update automatically

  Scenario: truncating the list of channels
    Given I am viewing a list of channels for a role
    When the number of channels exceeds a pre-defined number
    Then the list of channels is truncated at the pre-defined number
      And the remainder is displayed as "+ N more"