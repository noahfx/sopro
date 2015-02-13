Feature: Incoming message queueing
  As a Society Pro user
  I want my incoming messages to be saved and handled
  So that I can see and use the latest information from the system and my peers

  Scenario: incoming message in the message queue
    Given there is a message in the incoming message queue
    When the message is received
    Then a worker parses the message
