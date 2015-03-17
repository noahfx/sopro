# Ensure nvm binary selection is respected by sudo:
export NVM_DIR="/home/ubuntu/.nvm"
. "$NVM_DIR/nvm.sh"
alias sudo='sudo '

nvm use 0.12
~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 5


sudo npm start &

sleep 5

sudo npm run api

# stop vertx

pkill -n java
pkill -n node
