Feature: SSL/TLS Certificate Use
  As a Society Pro enterprise edition administrator
  I want to to be able to designate SSL/TLS certificates for Society Pro
  So that my users can trust that they are connected to my Society Pro server

  Scenario: SSL certificate
    Given I have an SSL certificate
    When Society Pro is configured to use that certificate
    Then users will receive that certificate when connecting to Society Pro over https

  Scenario: redirection to SSL/TLS
    Given I am using an application capable of http requests
    When I connect to the Society Pro server with http
    Then I am redirected to https
      And the transaction is secured with SSL/TLS