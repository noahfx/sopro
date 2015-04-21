# Ensure nvm binary selection is respected by sudo:
export NVM_DIR="/home/ubuntu/.nvm"
. "$NVM_DIR/nvm.sh"

nvm use 0.10
#nvm alias default 0.11

~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 10

npm install

cd couchdb
node populate-couchdb-mocks.js --wipe
cd ..

# Redirect stdout, but not stderr:
sudo npm run start -- $1 > server.log &

sleep 5

npm run api

# stop vertx

pkill -n java
pkill -n node
