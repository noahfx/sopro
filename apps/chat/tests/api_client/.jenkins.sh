# Ensure nvm binary selection is respected by sudo:
export NVM_DIR="/home/ubuntu/.nvm"
. "$NVM_DIR/nvm.sh"

nvm use 0.12
nvm alias default 0.12

~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 10


npm start &

sleep 5

npm run api

# stop vertx

pkill -n java
pkill -n node
