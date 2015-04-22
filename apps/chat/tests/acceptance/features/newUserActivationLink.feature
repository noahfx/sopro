Feature: New user activation link
  As a Society Pro Enterprise Edition user
  I want to receive an activation link when my user is created
  So that I can securely set a password on my user account

  Scenario: mismatched passwords
    Given I have an valid activation token
    When I visit the confirm account page for that token
      And I set mismatched passwords
    Then I should not be able to submit the form

  Scenario: valid activation link
    Given I have a valid activation token
    When I visit the confirm account page for that token
    And I set a secure password
    Then my password is created

  Scenario: reusing an activation link
    Given I have a valid activation token
    When I visit the confirm account page for that token
    And I set a secure password
    And I visit the confirm account page for that token
    Then I should see a failure message

  Scenario: invalid activation link
    Given I have an invalid activation token
    When I visit the confirm account page for that token
    Then I should see a failure message