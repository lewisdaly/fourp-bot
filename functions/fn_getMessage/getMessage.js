const functions = require('firebase-functions');
const validate = require('express-validation')
const express = require('express');

const validation = require('./validation');
const isNullOrUndefined = require('../common/utils').isNullOrUndefined;

const app = express();


app.get('*/:messageId', validate(validation), (req, res) => {
  const { messageId } = req.params;
  const { language } = req.query;
  console.log(messageId, language);

  res.status(200).send(getMenu(language));
});


const getMenu = (language) => {
  return {
   "messages": [
      {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
              {
                "title":"Chatfuel Rockets T-Shirt",
                "image_url":"https://rockets.chatfuel.com/img/shirt.png",
                "subtitle":"Soft white cotton t-shirt with CF Rockets logo",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://rockets.chatfuel.com/store/shirt",
                    "title":"View Item"
                  }
                ]
              },
              {
                "title":"Chatfuel Rockets Hoodie",
                "image_url":"https://rockets.chatfuel.com/img/hoodie.png",
                "subtitle":"Soft grey cotton hoddie with CF Rockets logo",
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://rockets.chatfuel.com/store/hoodie",
                    "title":"View Item"
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}

module.exports = functions.https.onRequest(app);
