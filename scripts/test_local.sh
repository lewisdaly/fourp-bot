#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#make sure we are using nvm, which will set node v6.11
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm


## manually change over the webhook

## use localtunnel to expose this over ssl
echo "Go to: https://developers.facebook.com/apps/1520746361305495/webhooks/, and update the webhook to the following:"
lt --port 5000 | awk '{print $4"/fourp-bot/us-central1/bot/facebook/receive"}' &
echo 'with the verify token: test-fourp-bot'

sleep 2

## start the local firebase server
node --version
cd "$DIR"/../functions/
firebase serve --only functions
