Feature: Opening and closing dropdowns
  As a Society Pro user
  I want to be able to open and close dropdowns with intuitive mouse clicks
  So that I am not distracted by my UI

  Scenario: Opening a dropdown
    Given I have started the chatlog application
      And I am viewing a long list of channels
      And I have a point of origin visible
    When I click the point of origin
    Then the dropdown is visible

  Scenario: Clicking the same point of origin with an open dropdown
    Given I have a point of origin visible
      And the dropdown is already visible
    When I click the point of origin
    Then the dropdown is visible

  Scenario: Clicking a different point of origin with an open dropdown
    Given I have a second point of origin visible
      And the dropdown is already visible
    When I click the second point of origin
    Then the dropdown is not visible
      And the second dropdown is visible

  Scenario: Closing a dropdown by clicking outside it
    Given the dropdown is already visible
    When I click somewhere other than the dropdown or a point of origin
    Then the dropdown is not visible

  Scenario: Opening a nested dropdown
    Given the test is not pending
      And the dropdown is already visible
      And I have a nested point of origin visible
    When I click the nested point of origin
    Then the dropdown is visible
      And the nested dropdown is visible

  Scenario: Opening a second primary dropdown while a primary and nested dropdown are shown
    Given the test is not pending
      And the dropdown is already visible
      And the nested dropdown is already visible
      And I have a second point of origin visible
    When I click the second point of origin
    Then the dropdown is not visible
      And the nested dropdown is not visible
      And the second dropdown is visible

  Scenario: Opening a second nested dropdown while a primary and nested dropdown are shown
    Given the test is not pending
      And the dropdown is already visible
      And the nested dropdown is already visible
      And I have a second nested point of origin visible
    When I click the second nested point of origin
    Then the dropdown is visible
      And the nested dropdown is not visible
      And the second nested dropdown is visible

  Scenario: Closing a nested dropdown but not the primary dropdown
    Given the test is not pending
      And the dropdown is already visible
      And the nested dropdown is already visible
      And I have a non-point-of-origin visible within the dropdown
    When I click the non-point-of-origin
    Then the dropdown is visible
      And the nested dropdown is not visible