# Ensure nvm binary selection is respected by sudo:
export NVM_DIR="/home/ubuntu/.nvm"
. "$NVM_DIR/nvm.sh"

nvm use 0.10

sudo /etc/init.d/xvfb start

sudo /etc/init.d/selenium start

# lift the vertx app
~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 10

# install dependencies of protractor-cucumber-junit:
cd lib/protractor-cucumber-junit
npm install --production
cd ../..

npm install

cd couchdb
node populate-couchdb-mocks.js
cd ..

# Redirect stdout, but not stderr:
sudo npm run start -- $1 > server.log &

sleep 5

# run protractor acceptance tests
npm run acceptance | tee tests/acceptance/cucumber-report.json

# stop vertx
pkill -n java

pkill -n node
