sudo /etc/init.d/xvfb start

sudo /etc/init.d/selenium start

# lift the sails app
npm start &

sleep 30

# run protractor GUI tests
sudo npm run protractor

# stop sails
pkill node