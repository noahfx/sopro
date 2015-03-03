Feature: GET channel subscribers via API
As a Society Pro user
I want to be able to receive a list of my peers that are subscribed to a specific channel via API
So that I can use and/or develop rich messaging applications

Scenario: listing channel subscribers via API
Given I have a valid authentication token
And I have a role with correct permissions on the channel
When I make the correct GET request to the API server with a channel id
Then the response should contain a list of peers that are subscribed to that channel