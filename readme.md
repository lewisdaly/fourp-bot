# 4PBot

4PBot is a prototype chatbot application for Filipinos on social welfare.

This project is built and managed by Vessels Tech, a IT-for-development Social enterprise, with support from DFS Lab and the Bill & Melinda Gates Foundation.

- **[Vessels Tech](https://vesselstech.com)**
- **[4PBot](https://4pbot.com)**
- **[DFS Lab](https://google.com)**

## Overview

This application was built using Firebase FaaS. It follows a **modular** and **composed** approach to application development, wherein each core feature of the bot has been implemented in a standalone function.

### Functions

Each function has it's own sub directory, in `functions/fn_<function_name>`.

### fn_bot

Bot is the core implementation of the chatbot. It uses BotKit, an open source framework for bot building, with support for Facebook bots.

#### Bot Skills

In Botkit terminology, a 'skill' is a conversation a user can have with the bot.

##### Calculate
##### Feedback
##### Get Started
##### Menu
##### News
##### Payout
##### Record Date
##### Report
##### Talk

### fn_calculatePay

CalculatePay takes a set of variables, such as the number of children at certain ages, and estimates the monthly payout for a 4Ps recipient. It also returns a set of requirements the 4ps recipient must comply with to recieve the payout.


### fn_getDelay

GetDelay takes a zip code, and attempts to estimate the next payout day for that location, using simple averages. This function has been disabled in production for the time being (by hiding it from the menu), as we don't have enough data to make this accurate.

### fn_getNews

GetNews returns 3 short news stories in the given language, English, Cebuano or Tagalog. News stories are updated using Google Sheets, and written to the Firebase Database using a Zapier integration.

### fn_lookupLocation

LookupLocation attempts to lookup a location of the user for a given zip code.

## Architecture

This application is hosted on Google's Firebase functions, and uses

### Firebase

Since firebase calls external APIs (eg. Zapier), you must enable the Blaze plan (pay as you go).

### Zapier

Zapier is the glue between Firebase and Google Sheets. Using Zapier webhooks, we can simply export user's submissions to Google Sheets, allowing for easy export, translation and analysis.

We also use Zapier to update the 4Pbot news section of the bot, making it easy for translators to update information without needing to implement a full CMS.

### Google Sheets

To allow for rapid protoyping, we utilized Google Sheets along with Zapier as a pseudo CMS for getting data in and out of the bot. Google sheets already has excellent user management, permissions features, as well as a familiar user interface.

## Installation

Feel free to fork this repo and have a play around! In order to get all the pieces working you will also need to configure Google Sheets and Zapier, which won't be described here.

Requirements:
- `nodejs`
- `firebase`
- `localtunnel`
- a firebase account with Blaze configured *(if you want to make external requests that is)*

## Testing
Since this bot requires Facebook messenger to run, we can't exactly test locally. However, we can use localtunnel or some other tool to expose a locally running server to Facebook messenger.

```bash
#start the local tunnel server, forwarding exposing localhost:5000 to fourp.localtunnel.net
./scripts/local_webhook.sh

#in a different shell, run firebase functions locally
./scripts/test_local.sh
```

You will then need to configure a test messenger account at developer.facebook.com ...


## Deployments

All deployments are currently run manually. We simply use the firebase cli to run a new deployment.

```
firebase deploy
```

### Deploying to production

We have 2 different firebase projects, development and live.
**development:** `totemic-chimera-110104`
**live:**      `fourp-bot`

```
firebase use default
firebase deploy
```


## Setup the GetStarted Button:
The BotKit documentation says that it allows you to edit the Get Started behaviour, but I found this not to work for me.

Instead, you can congigure the Get Started behaviour using the Facebook API Directly.

```bash
#look in this script for get started configuration
./scripts/setup_get_started.sh
```

## License

This project is 
