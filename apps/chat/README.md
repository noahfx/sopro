# SocietyPro Chat

Our SocietyPro Chat


## Getting Started

To get you started you can simply clone the sopro repository and install the dependencies:

### Prerequisites

You need git to clone the sopro repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test sopro chat. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

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
* `assets/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
sopro chat changes this location through the `.bowerrc` file.  Putting it in the assets folder makes
it easier to serve the files by a webserver.*

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:1337/`.



## Directory Layout

```
api/                   --> This folder contains the vast majority of your app's back-end logic. It is home to the 'M' and 'C' in MVC Framework.
  controllers/           --> This is the directory that holds your controllers. In Sails, controllers are javascript files that contain logic for interacting with models and rendering appropriate views to the client.
  models/                --> This is the directory that holds your models. In Sails, models are the structures that contain data for your Sails App.
  policies/              --> This is the folder you will store your policy files in. A policy file is a .js file that contains what is essentially express middleware for authenticating access to controller actions in your app.
  response/              --> This folder holds the logic for issuing server responses to your clients.
  services/              --> 'Services' are similar to controller actions but are typically used for things that don't nessecarily have to happen between the time when the user sends a request and when the server sends back a response.
assets/                 --> It houses all of the static files that your app will need to host.
  images/                --> all your images goes here
  js/                    --> This is where you put client-side javascript files that you want to be statically hosted by your app.
  css/                   --> This is where you will put all of the .css files that you would like to be statically hosted by your app.
config/                 --> This folder contains various files that will allow you to customize and configure your Sails app.
views/                  --> This is the directory that holds all of your custom views.
```

## Testing

There are four kinds of tests in the angular-seed application: Unit tests and End to End tests.

### Running Unit Tests

The sopro chat app comes preconfigured with unit tests for the frontend and for the backend.

#### Frontend

These are written in [Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `tests/unit/karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `tests/unit/karma/*.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```

#### Backend

These are written in [Jasmine][jasmine], which we run with the [Mocha][mocha]. 

* the unit tests are found next to the code they are testing and are named as `tests/unit/mocha/*.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm run mocha
```

### API testing

The SocietyPro chat comes with [Postman][postman] testing tool. Postman is an api testingo tool. [Newman][newman] takes care of running postman's tests. For this you only need to run:

* the api tests are found in `tests/api_client/collections/`

Protractor make api requests with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

Once you have ensured that the development web server hosting our application is up and running, you can run the api tests using the supplied npm script:

```
npm run newman
```


### End to end testing

The SocietyPro chat app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `tests/gui/protractor.conf.js`
* the end-to-end tests are found in `tests/gui/specs/`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
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
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.

### Acceptance tests

And finally, SocietyPro Chat app also comes with acceptance tests, for this we use [Cucumber][cucumber], the popular Behaviour-Driven Development tool.

* the features are found at `tests/acceptance/features/`

You can run the cucumber tests using the supplied npm script:

```
npm run cucumber
```

### Running the App during Development

The SocietyPro chat project comes preconfigured with a local development webserver.  It is a node.js
framewrok called [SailsJS][sailsjs].  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g sails
```

Then you can start your own development web server by
running:

```
npm start
```

## Continuous Integration

### Jenkins

[Jenkins][jenkins] is a continuous integration service, which can monitor GitHub for new commits
to your repository and execute scripts such as building the app or running tests. The SocietyPro
chat project has a Jenkins Server that biulds and runs all the tests. You can see the pipeline [here](http://ci.societypro.org:8080/view/huevon_tests/).

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