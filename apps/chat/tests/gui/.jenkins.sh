~/vert.x-2.1.5/bin/vertx run -cluster mock-backend.vertx.js  &

sudo /etc/init.d/xvfb start

sudo /etc/init.d/selenium start

# lift the vertx app
~/vert.x-2.1.5/bin/vertx -cluster run server.js &

sleep 15

# run protractor GUI tests
sudo npm run gui

# stop vertx
pkill -n java

pkill -n java
