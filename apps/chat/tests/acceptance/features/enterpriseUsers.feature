Feature: Remove Roles from Toolbar Dropdown
  As a Society Pro enterprise edition administrator
  I don't want users to have the ability to choose from multiple roles
  Because we enforce a strict real name policy

  Scenario: default role chosen on login
    Given I am using the Society Pro Enterprise Edition
    When I launch the application
      And I authenticate
    Then the application should use the default role for my user

  Scenario: no role choices for enterprise users
    Given I am using the Society Pro Enterprise Edition
    When I click the toolbar dropdown button associated with my username
    Then I should not see multiple roles listed