const functions = require('firebase-functions');
const env = require('node-env-file');
const Botkit = require('botkit');
yaml = require('js-yaml');
fs   = require('fs');


env(__dirname + '/.env');

const controller = Botkit.facebookbot({
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
});

const app = require(__dirname + '/components/express_webserver.js')(controller);
require(__dirname + '/components/subscribe_events.js')(controller);

/* Load the scripts from yaml */

//TODO: make this more flexible... how do we allow user to change languages for example?
let script = null;
const normalizedPath = require("path").join(__dirname, "skills");
try {
  script = yaml.safeLoad(fs.readFileSync(normalizedPath + '/eng_script.yaml'));
  console.log(script);
} catch (err) {
  console.log(err);
}

/* Load the skills */
fs.readdirSync(normalizedPath).forEach(function(file) {
  if (file.indexOf('.js') === -1) {
    return;
  }
  require("./skills/" + file)(controller, script);
});


module.exports = functions.https.onRequest(app);
