# Ensure nvm binary selection is respected by sudo:
export NVM_DIR="/home/ubuntu/.nvm"
. "$NVM_DIR/nvm.sh"

nvm use 0.10

sudo /etc/init.d/xvfb start

sudo /etc/init.d/selenium start

# lift the vertx app
~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 10

#For some reason this fails if it's not run first:
npm install cucumber-junit
npm install

cd couchdb
node populate-couchdb-mocks.js
cd ..

sudo npm run start -- $1 &

sleep 5

# run protractor GUI tests
npm run acceptance

# stop vertx
pkill -n java

pkill -n node
