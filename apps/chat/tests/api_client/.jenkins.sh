~/vert.x-2.1.5/bin/vertx run -cluster mock-backend.vertx.js  &

npm install

~/vert.x-2.1.5/bin/vertx run -cluster server.js &

sleep 15

npm run newman

# stop vertx
pkill -n java

pkill -n java