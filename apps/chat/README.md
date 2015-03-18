# SocietyPro Chat

Our SocietyPro Chat


## Getting Started

To get you started you can simply clone the sopro repository and install the dependencies:

### Prerequisites

You need git to clone the sopro repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to test sopro chat. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

##### For windows 
You need to install:
  * .net framework 2 sdk
  * Microsoft visual studio 2005



To run the acceptance tests, you need `cucumber` on your path: `npm install -g cucumber`

SocietyPro Chat uses vertx, so you need to have [vertx](http://vertx.io/) installed. You can download it [here](http://vertx.io/downloads.html). 

### Clone sopro

Clone the sopro repository using [git][git]:

```
git clone https://github.com/SocietyPro/sopro.git
cd sopro/apps/chat/
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `web/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
sopro chat changes this location through the `.bowerrc` file.  Putting it in the assets folder makes
it easier to serve the files by a webserver.*


#### Couchdb
We currently use CouchDB as a persistency layer for our user objects.  
Install couchdb then test if it's running with: `curl localhost:5984`.  
Once it's set, configure your CouchDB host and port in `apps/chat/cfg/servers.cfg.js`.  
Finally, bootstrap the database (installing mock data and view functions) like this:

```
cd apps/chat/couchdb
node populate-couchdb-mocks.js
```

Confirm that it worked with `curl localhost:5984/mocks`.

### Run the Application
There are two servers involved. You need both of them.  
First, start the vertx eventbus server. This hosts a websocket that lets non-JVM code talk to the eventbus. It also spawns a mock-backend verticle that handles API requests, returning mocks.

```
vertx run server.vertx.js
```

Second, start the node.js http server to host angular:

```
npm start
```

Now browse to the app at `http://localhost:8080/`.

## Directory Layout

```
cfg/                   --> This folder contains configuration files
web/                   --> This folder contains all the frontend logic and views
tests/                 --> Unit, E2E, API and acceptance tests
```

## Testing

There are four kinds of tests included: Unit tests, API tests, GUI tests, and Acceptance tests.

### Running Unit Tests

The sopro chat app comes preconfigured with unit tests for the frontend and for the backend.

#### Frontend

These are written in [Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `tests/unit/karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `tests/unit/karma/*.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm run unit
```

### API testing

The SocietyPro chat comes with [Postman][postman] testing tool. Postman is an api testingo tool. [Newman][newman] takes care of running postman's tests. For this you only need to run:

* the api tests are found in `tests/api_client/collections/`

Newman makes API requests to our web app and verifies that the application responds
correctly. Make sure both node and vertx are running first:

```
vertx run server.vertx.js
npm start
```

Once you have ensured that the development web server hosting our application is up and running, you can run the api tests using the supplied npm script:

```
npm run api
```


### End to end testing

The SocietyPro chat app comes with end-to-end GUI tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `tests/gui/protractor.conf.js`
* the end-to-end tests are found in `tests/gui/specs/`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Make sure both node and vertx are running first:

```
vertx run server.vertx.js
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The angular-seed
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run gui
```

### Acceptance tests

And finally, SocietyPro Chat app also comes with acceptance tests, for this we use [Cucumber][cucumber], the popular Behaviour-Driven Development tool.

* the features are found at `tests/acceptance/features/`

Cucumber also simulates interaction with our web app and verifies that the application responds
correctly. Make sure both node and vertx are running first:

```
vertx run server.vertx.js
npm start
```

You can run the cucumber tests using the supplied npm script:

```
npm run acceptance
```

## Continuous Integration

### Jenkins

[Jenkins][jenkins] is a continuous integration service, which can monitor GitHub for new commits
to your repository and execute scripts such as building the app or running tests. The SocietyPro
chat project has a Jenkins Server that biulds and runs all the tests. You can see the master pipeline [here](http://ci.societypro.org:8080/view/huevon_tests/) and the staging pipeline [here](http://ci.societypro.org:8080/view/sopro.staging/).

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[jenkins]: https://travis-ci.org/
[sailsjs]: http://sailsjs.org/#/
[cucumber]: https://cukes.info/
[mocha]: http://mochajs.org/
[postman]: http://www.getpostman.com/
[newman]: https://github.com/a85/Newman