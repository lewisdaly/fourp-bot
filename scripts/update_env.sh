#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Set up the firebase env variables
source $DIR/../functions/fn_bot/.env_fn_bot;

firebase functions:config:set \
  fn_bot.page_token="$page_token" \
  fn_bot.verify_token="$verify_token" \
  fn_bot.studio_token="$studio_token" \
  fn_bot.studio_command_uri="$studio_command_uri" \
  fn_bot.port="$PORT" \
  fn_bot.firebase_uri="$firebase_uri"


firebase deploy --only functions
