Feature: GET users via API
As a Society Pro Enterprise Edition administrator
I want to be able to GET a list of local users via API
So that I can use and/or develop rich administrative applications

Scenario: GETting a list of users
Given I have a valid authentication token
And the authentication token is for an identity that is authorized to read users
When I make the correct request via http GET
Then I should receive a list of local users