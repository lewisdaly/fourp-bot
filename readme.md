# 4PBot

4PBot is a prototype chatbot application for Filipinos on social welfare.

This project is built and managed by Vessels Tech, a IT-for-development Social enterprise, with support from DFS Lab and the Bill & Melinda Gates Foundation.


insert links here!


## Overview

Go through each function?


## Architecture
- Botkit
- firebase
- Zapier
- Google Sheets

## Testing
Since this bot requires Facebook messenger to run, we can't exactly test locally. However, we can use localtunnel or some other tool to expose a locally running server to Facebook messenger,

First,


## Setup the GetStarted Button:
```
./scripts/setup_get_started.sh
```


## Deployments

All deployments are currently run manually. We simply use the firebase cli to run a new deployment.

```
firebase deploy
```

### Deploying to production

```
firebase use default
firebase deploy
```
