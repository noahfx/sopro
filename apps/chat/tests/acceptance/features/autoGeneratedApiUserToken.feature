Feature: Automatically Generated API User Token
  As a Society Pro API user
  I want to automatically have an API token for each of my identities
  So that I can develop and/or use rich messaging applications

  Scenario: automatically generating an API token
    Given I am authorized to create new users
    When I create a new user
    Then an API token should be automatically generated for that user

  Scenario: viewing the API token via http
    Given I have an authenticated session
    When I go to the correct route
    Then I should see my API token

  Scenario: transforming the token into a user
    Given I have a valid token associated with a user
    When I make a request to the API with that token
    Then the server should use that user