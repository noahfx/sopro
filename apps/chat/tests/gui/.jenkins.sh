sudo apt-get install -y nodejs

# npm install will also do bower installations
npm install
npm run webdriver-update

# lift the sails app
npm start &

# an x server emulator
Xvfb :1 -screen 0 1280x768x24 &

# run protractor GUI tests
npm run protractor

# stop sails
pkill node

# kill Xvfb
pkill Xvfb