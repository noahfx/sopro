Feature: Channels overflow dropdown
  As a Society Pro user
  I want to see a list of channels to which my role is subscribed
  So that I can select which channel's history to show

  Scenario: viewing an overflow list of channels
    Given I am viewing a long list of channels
    When I click "+N more..."
    Then I should see the entire list of channels to which that role is subscribed