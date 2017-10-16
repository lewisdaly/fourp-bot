#!/usr/bin/env bash

#make sure we are using nvm, which will set node v6.11
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm


## use localtunnel to expose this over ssl
echo "Go to: https://developers.facebook.com/apps/1520746361305495/webhooks/, and update the webhook to the following:"
echo 'with the verify token: test-fourp-bot'
lt -s fourp -p 5000 | awk '{print $4"/fourp-bot/us-central1/bot/facebook/receive"}'
