Feature: PUT a user via API
As a Society Pro Enterprise Edition user
I want to be able to PUT user data edits
So that I can use and/or develop rich administrative applications

Scenario: PUTting a user
Given I have a valid authentication token
And the authentication token is for an identity with the authorization to PUT /users
When I make the correct https PUT request with edited user data
Then the user data should be updated