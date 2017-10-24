

## Testing locally:
```
nvm use v6.11.1


firebase serve --only functions

curl "http://localhost:5000/fourp-bot/us-central1/getNews?language=ceb"

curl " http://localhost:5000/fourp-bot/us-central1/calculatePay?expecting_baby=yes&young_children=1&elementary_school_children=1&high_school_children=1

curl "https://us-central1-fourp-bot.cloudfunctions.net/calculatePay/?expecting_baby=yes&young_children=1&elementary_school_children=1&high_school_children=1"

curl -X GET \
  'http://localhost:5000/fourp-bot/us-central1/getMessage/menu?langauge=ceb' \

curl -X GET 'http://localhost:5000/fourp-bot/us-central1/getDelay/?langauge=ceb&zip_code=5000'

curl -X POST \
    https://hooks.zapier.com/hooks/catch/2292424/i9l7nx/ \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H 'postman-token: c3c6a172-730a-90e9-18bf-6f24e98ea0f8' \
    -d '{
    "user_id": "user_id",
    "first_name": "first_name",
    "last_name": "last_name",
    "phone_number": "phone_number",
    "langauge": "langauge",
    "report_type": "reportType",
    "description": "desc",
    "lat": "lat",
    "lng": "lng",
    "address": "address",
    "country": "country",
    "zip": "zip"
  }'



```


## Setup the GetStarted Button:
```
./scripts/setup_get_started.sh
```


## Webhook url:

https://us-central1-fourp-bot.cloudfunctions.net/bot/facebook/receive
