Feature: New user activation link
  As a Society Pro Enterprise Edition user
  I want to receive an activation link when my user is created
  So that I can securely set a password on my user account

  Scenario: activation link
    Given I have received a one-time activation link
    When I click the link
    Then the system should check that the activation link is valid
      And I should be prompted to set a secure password

  Scenario: reusing an activation link
    Given I have received a one-time activation link
    And the activation link has already been used
    When I click the link
    Then the system should check that the activation link is valid
      And I should see a failure message