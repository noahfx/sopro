# 0.1.4 Feature: Dropdowns (2015-03-18)
Now the HTTP server that hosts angular is back to using Node again.
VertX is still used; it hosts a websocket HTTP server and a mock backend verticle.
Now we have collections dropdowns that describe comm panel collection elements,
and subscribers dropdowns that describe the subscribers to a channel.


# 0.1.0 Vertx (2015-02-18)

Now SocietyPro run in vertx and not in node anymore.

## Features
- **GET Channels API** ([d89dde0](https://github.com/jimmymorales/sopro/commit/d89dde071304ebbe97be1240a5662bcedf939fed))

# 0.0.1 Continues-integration-projects (2015-02-11)

## Features

- **Setup jenkins server**: Our jenkins server now runs automated tests for:
  - Karma Unit Tests ([e506a1c](https://github.com/jimmymorales/sopro/commit/e506a1c7b883844771f086f647232545dae0926b)),
  - Mocha Unit Test ([e506a1c](https://github.com/jimmymorales/sopro/commit/e506a1c7b883844771f086f647232545dae0926b))
  - Postman API Tests ([121b308](https://github.com/jimmymorales/sopro/commit/121b3081765f1aeba6781ab86aa1f3071b2a1a28)),
  - Protractor Gui Tests ([5fcd447](https://github.com/jimmymorales/sopro/commit/5fcd4477149195a66bbbf3b784f1f3fd4f1b6f53)),
  - Cucumber Acceptance Tests ([38cf4ce](https://github.com/jimmymorales/sopro/commit/38cf4ce5d51f9ebe1be4cdb6980494649201f286))