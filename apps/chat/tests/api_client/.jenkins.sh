sudo npm install bower -g
sudo npm install sails -g
npm install rc --save
npm install ejs --save

npm install

sails lift &

sleep 10

npm run newman

pkill node