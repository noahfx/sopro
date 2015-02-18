sudo /etc/init.d/xvfb start

sudo /etc/init.d/selenium start

# lift the sails app
~/vert.x-2.1.5/bin/vertx run server.js &

sleep 15

# run protractor GUI tests
sudo npm run protractor
