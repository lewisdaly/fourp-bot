
## Logs filters

These are some filters which may be helpful:

```
resource.type="cloud_function"
textPayload:"[Start]" AND "Conversation"
```


## Bigquery

Get the number of conversations in given day:

``` SQL
SELECT
  SUM(1)
FROM
  [fourp-bot:test_logs.cloudfunctions_googleapis_com_cloud_functions_20171127]
WHERE
  textPayload CONTAINS "Conversation" AND textPayload CONTAINS "Start"
GROUP BY
  logName
LIMIT
  1000
```



## From Command line:

This approach will do for now. It won't however scale, or give us better metrics than simple totals etc.


``` bash
#only need to do this once
gcloud config set project fourp-bot


gcloud logging read "resource.type=cloud_function AND textPayload:Conversation AND textPayload:Start" --limit 10
gcloud logging read "resource.type=cloud_function AND textPayload:Conversation AND textPayload:Start"

gcloud logging read "resource.type=cloud_function AND textPayload:Conversation AND textPayload:Start" --freshness 2d


gcloud logging read \
  "resource.type=cloud_function AND textPayload:Conversation AND textPayload:Start" \
  --freshness 100d  --format json > logs/conversations_start

gcloud logging read \
  "resource.type=cloud_function AND textPayload:Conversation AND textPayload:End" \
  --freshness 100d  --format json > logs/conversations_end
```


``` bash
#get the number of conversations started:
cat logs/conversations_start | grep "textPayload" | wc -l

#get the number of conversations ended:
cat logs/conversations_end | grep "textPayload" | wc -l
```
