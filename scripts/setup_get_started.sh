#!/usr/bin/env bash


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../.env

URL="https://graph.facebook.com/v2.6/me/messenger_profile?fields=get_started,greeting&access_token=$PAGE_ACCESS_TOKEN"
curl -X GET "$URL"

URL="https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$PAGE_ACCESS_TOKEN"
curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload":"getStarted"},
  "greeting":[{"locale":"default", "text":"Hello! I am 4PBot!"}]
}' "$URL"
