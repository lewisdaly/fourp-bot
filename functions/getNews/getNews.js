
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const paths = require('../common/definitions').paths;


/**
 * query params:
 * - language ISO 63903 *required*, must be eng, tgl, ceb
 */
module.exports = functions.https.onRequest((req, res) => {
  const { language } = req.query;

  if (!language) {
    return res.status(400).send('language is required. must be one of \'eng, tgl, ceb\'');
  }

  if (['eng', 'tgl', 'ceb'].indexOf('ceb') == -1) {
    return res.status(400).send('language must be one of \'eng, tgl, ceb\'');
  }

  return getNews(language)
  .then(news => {

    return res.status(200).send(news);
  })
  .catch(err => {
    console.log(err);
    return res.status(500).send(err);
  });
});


/**
 *
 */
const formatMessage = (stories) => {
  // return {
  //   messages: stories
  // };


  return {
   "messages": [
      {
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"list",
            "top_element_style":"large",
            "elements":[
              {
                "title":"Chatfuel Rockets T-Shirt",
                "subtitle":"Soft white cotton t-shirt with CF Rockets logo",
              },
              {
                "title":"Chatfuel Rockets Hoodie",
                "subtitle":"Soft gray cotton t-shirt with CF Rockets logo",
              }
            ]
          }
        }
      }
    ]
  }
}

/**
 * Format a message for chatfuel
 * ref: http://docs.chatfuel.com/plugins/plugin-documentation/json-api
 */
const formatStory = (title, content) => {
  return {text: content};
}

const getNews = (language) => {
  return admin.database().ref(paths.news).once('value')
  .then(snapshot => snapshot.val())
  .then(values => {
    console.log('values', Object.keys(values).filter(key => key.indexOf(language) > -1));

    //Filter for the language code:
    const stories = Object.keys(values)
                 .filter(key => key.indexOf(language) > -1)
                 .map(key => values[key])
                 .map(value => formatStory('1', value));

    return formatMessage(stories);
  });
}
