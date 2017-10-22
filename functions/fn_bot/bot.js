const functions = require('firebase-functions');
const Botkit = require('botkit');
const FirebaseStorage = require('botkit-storage-firebase');
const FBUser = require('botkit-middleware-fbuser');
const yaml = require('js-yaml');
const fs   = require('fs');

const { scriptForLanguage } = require('./util');
const {
  verify_token,
  access_token,
  studio_token,
  studio_command_uri,
  firebase_uri
} = require('./env')(functions);

console.log('firebase_uri is:', firebase_uri);

const storage = FirebaseStorage({firebase_uri})
const controller = Botkit.facebookbot({
    verify_token,
    access_token,
    studio_token,
    studio_command_uri,
    storage,

		//ref: https://github.com/howdyai/botkit/blob/master/docs/readme-facebook.md#require-delivery-confirmation
    // Don't think we need these:
		// require_delivery: true,
    // receive_via_postback: true,
});

const fbuser = FBUser({
    accessToken: process.env.page_token,
    fields: ['first_name', 'last_name', 'locale', 'profile_pic','timezone','gender'],
    logLevel: 'debug',
    expire: 7 * 24 * 60 * 60 * 1000, // refresh profile info every week
    storage: storage
});
controller.middleware.receive.use(fbuser.receive);

const app = require(__dirname + '/components/express_webserver.js')(controller);
require(__dirname + '/components/subscribe_events.js')(controller);

/* Load the scripts from yaml */
const scriptsPath = require("path").join(__dirname, "scripts");
let scripts = {};
try {
  scripts.eng = yaml.safeLoad(fs.readFileSync(scriptsPath + '/eng_script.yaml'));
  scripts.tgl = yaml.safeLoad(fs.readFileSync(scriptsPath + '/tgl_script.yaml'));
  scripts.ceb = yaml.safeLoad(fs.readFileSync(scriptsPath + '/ceb_script.yaml'));
	controller.commonScript = yaml.safeLoad(fs.readFileSync(scriptsPath + '/common_script.yaml'));
} catch (err) {
  console.log(err);
}

/* Load the skills */
const skillsPath = require("path").join(__dirname, "skills");
fs.readdirSync(skillsPath)
	.filter(file => file.indexOf('.js') > -1)
	.forEach(file => require("./skills/" + file)(controller, scripts));


/* Default. Handle all other messages. This must be at the end. */
// controller.hears('.*', 'message_received', (bot, message) => {
//   console.log("Default Handler triggered");
//   const script = scriptForLanguage(scripts, message.user_profile.language);
//
//   bot.startConversation(message, (err, convo) => {
//     convo.ask({text: script.menu_button.text, quick_replies: [
//         {
//           content_type: "text",
//           title: script.menu_button.quick_reply_title,
//           payload: script.menu_button.redirect_to
//         }
//       ]
//     });
//   });
// });


module.exports = functions.https.onRequest(app);
