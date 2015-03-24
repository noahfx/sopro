Feature: Persisting Users
As a Society Pro enterprise edition administrator
I want persistent storage of every local "user"
So that I can manage the user database

Scenario: persisting users
Given I have configured a new user
When I "save" the user
Then the user is persisted