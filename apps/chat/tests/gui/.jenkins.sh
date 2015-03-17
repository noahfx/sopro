# Ensure nvm binary selection is respected by sudo:
#export NVM_DIR="/home/ubuntu/.nvm"
#. "$NVM_DIR/nvm.sh"
#
#nvm use 0.11

sudo /etc/init.d/xvfb start

sudo /etc/init.d/selenium start

# lift the vertx app
~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 10

npm start &

sleep 5

# run protractor GUI tests
npm run gui

# stop vertx

pkill -n java
pkill -n node
