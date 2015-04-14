Feature: User administration, Create
  As a Society Pro Enterprise Edition administrator
  I want to be able to manage the Society Pro user database
  So that I can ensure the security of Society Pro

  Scenario: viewing a list of local users
    Given I am a Society Pro Enterprise Edition administrator
    When I view the administration panel
      And I click the "users" tab
    Then I should see a list of all local users
  
  Scenario: adding a user
    Given I am a Society Pro Enterprise Edition administrator
      And I have a new user's details
    When I view the administration panel
      And I click the "users" tab
      And I enter those details
      And I submit those details
    Then the user is created
