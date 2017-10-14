
const functions = require('firebase-functions');
const paths = require('../common/definitions').paths;

module.exports = functions.https.onRequest((req, res) => {
  console.log('hey', paths);

  return res.status(200).send(true);
});
