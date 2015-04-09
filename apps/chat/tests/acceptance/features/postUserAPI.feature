Feature: POST a user via API
  As a Society Pro Enterprise Edition administrator
  I want to be able to POST new users via API
  So that I can use and/or develop rich administrative applications

  Scenario: POSTing a user
    Given I have a valid authentication token
      And the authentication token is for an identity with the authorization to create new users
    When I make the correct https POST request with a username and email address
    Then a new user should be created
      And an email should be sent to that email address with a one time activation link