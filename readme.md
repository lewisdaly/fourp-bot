

## Testing locally:
```
nvm use v6.11.1


firebase serve --only functions

curl "http://localhost:5000/fourp-bot/us-central1/getNews?language=ceb"

curl " http://localhost:5000/fourp-bot/us-central1/calculatePay?expecting_baby=yes&young_children=1&elementary_school_children=1&high_school_children=1


curl -X GET \
  'http://localhost:5000/fourp-bot/us-central1/getMessage/menu?langauge=ceb' \


```
