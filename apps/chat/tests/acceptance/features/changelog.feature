Feature: CHANGELOG.md
  As a Society Pro user
  I want to be able to read about the features, bugfixes, and documentation each version adds
  So that I can determine whether those features are desirable enough to make me download the latest version

  Scenario: viewing the latest added features
    Given I have downloaded the Society Pro source code
    When I list the source files
    Then I should see a file named CHANGELOG.md