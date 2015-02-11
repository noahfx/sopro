Feature: README documentation
  As a Society Pro user
  I want to read the most important information in the README.md
  So that I can find information on installing and using Society Pro right with the source files

  Scenario: reading the README
    Given I have downloaded the Society Pro source code
    When I list the source files
    Then I should see a file named "README.md"