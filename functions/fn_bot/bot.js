const functions = require('firebase-functions');
const env = require('node-env-file');
const Botkit = require('botkit');
const FirebaseStorage = require('botkit-storage-firebase');
const FBUser = require('botkit-middleware-fbuser');
const yaml = require('js-yaml');
const fs   = require('fs');


env(__dirname + '/.env_fn_bot');

const storage = FirebaseStorage({firebase_uri: process.env.firebase_uri})
const controller = Botkit.facebookbot({
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
    storage,

		//ref: https://github.com/howdyai/botkit/blob/master/docs/readme-facebook.md#require-delivery-confirmation
		// require_delivery: true,
    // receive_via_postback: true,
});

const fbuser = FBUser({
    accessToken: process.env.page_token,
    fields: ['first_name', 'last_name', 'locale', 'profile_pic','timezone','gender','is_payment_enabled'],
    logLevel:'error',
    expire: 24 * 60 * 60 * 1000, // refresh profile info every 24 hours
    storage: storage
});
controller.middleware.receive.use(fbuser.receive)

const app = require(__dirname + '/components/express_webserver.js')(controller);
require(__dirname + '/components/subscribe_events.js')(controller);

/* Load the scripts from yaml */

//TODO: make this more flexible... how do we allow user to change languages for example?
let script = null;
const skillsPath = require("path").join(__dirname, "skills");
const scriptsPath = require("path").join(__dirname, "scripts");
try {
  script = yaml.safeLoad(fs.readFileSync(scriptsPath + '/eng_script.yaml'));
	controller.commonScript = yaml.safeLoad(fs.readFileSync(scriptsPath + '/common_script.yaml'));
} catch (err) {
  console.log(err);
}

/* Load the skills */
fs.readdirSync(skillsPath)
	.filter(file => file.indexOf('.js') > -1)
	.forEach(file => require("./skills/" + file)(controller, script));


module.exports = functions.https.onRequest(app);
