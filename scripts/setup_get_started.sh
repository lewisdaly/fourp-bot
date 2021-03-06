#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z "$1" ]; then
	echo 'No environment set. Defaulting to development'.
	source $DIR/../functions/common/.env_development
else
	source $DIR/../functions/common/.env_"$1"
fi

URL="https://graph.facebook.com/v2.6/me/messenger_profile?fields=get_started,greeting&access_token=$page_access_token"
curl -X GET "$URL" || exit 1

URL="https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$page_access_token"
curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload":"hello"},
	"persistent_menu": [{
		"locale":"default",
    "composer_input_disabled": false,
    "call_to_actions":[
      {
        "title":"Get Started",
        "type":"postback",
        "payload":"Hi"
      },
      {
        "title":"Menu",
        "type":"postback",
        "payload":"menu"
      },
      {
        "type":"web_url",
        "title":"4PBot Site",
        "url":"https://4pbot.com",
        "webview_height_ratio":"full"
      }
    ]
	}],
  "greeting":[{"locale":"default", "text":"Hello! I am 4PBot!"}]
}' "$URL"
