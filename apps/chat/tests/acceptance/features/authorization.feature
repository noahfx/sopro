Feature: Action Authorization
As a Society Pro Enterprise Edition administrator
I want user actions to be validated against an authorization matrix
So that I can enforce security and organizational policies

Scenario: checking user authorization for success
  Given I am using the Society Pro Enterprise Edition
    And there is an authenticated user
    And that user is authorized to perform an action on an object
  When the user performs that action on that object
  Then the action should be taken

Scenario: checking user authorization for failure
  Given I am using the Society Pro Enterprise Edition
    And there is an authenticated user
    And that user is not authorized to perform an action on an object
  When the user performs that action on that object
  Then the action should not be taken
