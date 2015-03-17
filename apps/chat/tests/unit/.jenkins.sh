export NVM_DIR="/home/ubuntu/.nvm"
. "$NVM_DIR/nvm.sh"

nvm use 0.11
nvm alias default 0.11

npm install
#RUNS KARMA
npm run unit
#RUNS MOCHA
#npm run mocha