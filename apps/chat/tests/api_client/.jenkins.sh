~/vert.x-2.1.5/bin/vertx run server.vertx.js &

sleep 5

sudo npm start &

sleep 5

sudo npm run api

# stop vertx

pkill -n java
pkill -n node
