# Ensure nvm binary selection is respected by sudo:
export NVM_DIR="/home/ubuntu/.nvm"
. "$NVM_DIR/nvm.sh"

nvm use 0.10
#nvm alias default 0.11

cd couchdb
node populate-couchdb-mocks.js
cd ..

~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 10

npm install
sudo npm start &

sleep 5

npm run api

# stop vertx

pkill -n java
pkill -n node
