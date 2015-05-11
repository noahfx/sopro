Feature: Login Page
  As a user
  I want a login page
  So I can login

Scenario: Visiting the login page
  Given I am not logged in
  When I visit `/login`
  Then I should see a login form

Scenario: Logging in with valid credentials
  Given I am not logged in
    And I have valid credentials
  When I visit `/login`
    And I submit the credentials
  Then I should be logged in to the chat app

Scenario: Logging in with invalid credentials
  Given I am not logged in
    And I have invalid credentials
  When I visit `/login`
    And I submit the credentials
  Then I should not be logged in to the chat app
    And I should see a failure message about my credentials
    And the username should be prefilled with my last attempted credential