Feature: Administration panel link
  As a Society Pro Enterprise Edition administrator
  I want to quickly switch to a graphical configuration dashboard
  So that I can manage my application and users

Scenario: administrator authentication
  Given I am a Society Pro Enterprise Edition administrator
  When I authenticate to Society Pro
  Then I should see a link to an administration panel in the toolbar dropdown

Scenario: opening the administration panel
  Given I am a Society Pro Enterprise Edition administrator
  When I authenticate to Society Pro
    And I click the link to the administration panel
  Then I should see a panel with a default "users" tab
    And I should see a list of Society Pro users