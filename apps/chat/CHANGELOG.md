# 0.1.14 (2015-04-23)
* Open the Channel History for a channel
* Display new messages last
* Scroll to most recent message when channel history loads

# 0.1.13 (2015-04-21)
* GET messages via API: `/api/channel.history`

# 0.1.12 (2015-04-17)
* POST message via API: `/api/postMessage`

# 0.1.11 (2015-04-17)
* Finally we got persisted channels!
* `GET /api/channels`, `GET /api/channel.info`, `POST /api/channel` now store
  real data in the persistence backend instead of using mock data.

# 0.1.10 (2015-04-15)
* `PUT /api/users` route added, for modifying an existing user
* Admin panel (`/admin`) now allows admins to create new users
* Acceptance tests now output the results of each step, instead of each scenario

# 0.1.9 (2015-04-14)
* `/api/ping` now tells you where to get an api token, if the `token-auth` header was missing
* Now when a logged-out user requests a route which requires authentication, and successfully logs in,
  they are redirected to the route they originally requested, instead of `/`
* `/tests` folder reorganized
  ([b9bc370](https://github.com/SocietyPro/sopro/commit/b9bc370b9bc7dc4065969996ad181631dfcf52c6))

# 0.1.8 (2015-04-13)
Feature: Automatically Generated API User Token
* During API user creation in `POST /users` we now create and save an apiToken object for the new user's identity.
* Add route `GET /token`: If a user has a logged in browser session, this route shows their API token
* Add route `/api/ping`: This sends a test response even if the request lacks a valid API token.

# 0.1.7 (2015-04-9)
Create and save users. Improve cucumber-junit. Amazon SES emails.
Features:
* Administration Panel Link
  ([b5bccfa](https://github.com/SocietyPro/sopro/commit/b5bccfaa816bc2163c8270104121349632f99215))
* New user activation link and POST a user via API

# 0.1.6 (2015-03-31)
With the new SocietyPro Enterprise Edition we created new features:
* SocietyPro Authentication, remove roles from toolbar dropdown and SSL/TLS Certificate Use
  ([baf22d5](https://github.com/SocietyPro/sopro/commit/baf22d51cccb5fe0a76767c71fbefb74e532b9af))
* SocietyPro Authorization
  ([f8affd5](https://github.com/SocietyPro/sopro/commit/f8affd561442eb9668c1ba49bd4d86f0cb24e509))
* Persisting Users
  ([c0a8fe8](https://github.com/SocietyPro/sopro/commit/c0a8fe835d38079d3b964c79f9237752dd4048af))
* GET users via API
  ([6b2540a](https://github.com/SocietyPro/sopro/commit/6b2540a7ae2d1ff8b1869c35530c3cfdb03fef65))

# 0.1.5 (2015-03-18)
Someone accidentally already pushed a 0.1.4 tag to git. So we can't use that one again.
Git tag 0.1.5 now instead marks todays Feature:Dropdowns release.

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
