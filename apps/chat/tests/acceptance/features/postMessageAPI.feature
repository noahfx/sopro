Feature: POST message via API
As a Society Pro user
I want to POST a message via API
So that I can use and/or develop rich applications

Scenario: send message via API POST
Given I have an authentication token for an identity with the authorization to create new messages
When I make the correct POST request to /api/postMessage with a message and a channel name
Then the message should be persisted