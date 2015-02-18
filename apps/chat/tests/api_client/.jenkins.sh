npm install

~/vert.x-2.1.5/bin/vertx run server.js &

sleep 15

npm run newman

ps aux | grep -i vertx | awk {'print $2'} | xargs kill -9