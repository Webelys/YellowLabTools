#!/usr/bin/env bash

# APT-GET
sudo apt-get update
sudo apt-get install lsb-release libfontconfig1 libfreetype6 libjpeg-dev -y --force-yes
sudo apt-get install curl git python-software-properties build-essential make g++ -y --force-yes

# Installation of NodeJS
sudo curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
source ~/.profile

# Installation of some packages globally
npm install forever grunt-cli -g
source ~/.profile

# Installation of YellowLabTools
sudo mkdir /space
sudo chown $USER /space
cd /space
git clone https://github.com/gmetais/YellowLabTools.git --branch master
cd YellowLabTools
npm install || exit 1

# Front-end compilation
grunt build

# Start the server
rm server_config/settings.json
cp server_config/settings-prod.json server_config/settings.json
NODE_ENV=production forever start -c "node --stack-size=262000" bin/server.js