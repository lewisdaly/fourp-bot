#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#make sure we are using nvm, which will set node v6.11
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm


## start the local firebase server
node --version
cd "$DIR"/../functions/
firebase serve --only functions
