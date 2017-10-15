const functions = require('firebase-functions');
const env = require('node-env-file');
const Botkit = require('botkit');

env(__dirname + '/.env');

const controller = Botkit.facebookbot({
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
});

const app = require(__dirname + '/components/express_webserver.js')(controller);
require(__dirname + '/components/subscribe_events.js')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});


module.exports = functions.https.onRequest(app);
