sudo /etc/init.d/xvfb start

sudo /etc/init.d/selenium start

# lift the vertx app
~/vert.x-2.1.5/bin/vertx run server.js &

sleep 15

# run protractor GUI tests
sudo npm run cucumber

cat ./tests/acceptance/report.json | ./node-modules/.bin/cucumber-junit > tests/acceptance/test-out.xml 

# stop vertx
pkill -n java
