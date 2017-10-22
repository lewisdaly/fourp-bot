const functions = require('firebase-functions');
const Botkit = require('botkit');
const FirebaseStorage = require('botkit-storage-firebase');
const FBUser = require('botkit-middleware-fbuser');
const yaml = require('js-yaml');
const fs   = require('fs');

const { scriptForLanguage } = require('./util');
const { generateButtonsForTemplate } = require('./format');
const {
  verify_token,
  page_access_token,
  studio_token,
  studio_command_uri,
  firebase_uri
} = require('./env')(functions);

console.log('firebase_uri is:', firebase_uri);
console.log('page_access_token:', page_access_token);
console.log('verify_token:', verify_token);

const storage = FirebaseStorage({firebase_uri});
const controller = Botkit.facebookbot({
    verify_token,
    access_token: page_access_token,
    studio_token,
    studio_command_uri,
    storage,

		//ref: https://github.com/howdyai/botkit/blob/master/docs/readme-facebook.md#require-delivery-confirmation
    // Don't think we need these:
		// require_delivery: true,
    // receive_via_postback: true,
});

const fbuser = FBUser({
    accessToken: page_access_token,
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
controller.hears('.*', 'message_received', (bot, message) => {
  console.log("Default Handler triggered");
  const script = scriptForLanguage(scripts, message.user_profile.language);

  bot.startConversation(message, (err, convo) => {
    convo.ask({text: script.menu_button.text});
    const menuMessage = {
      attachment: {
        type: "template",
        payload: generateButtonsForTemplate(script.menu.buttons)
      }
    };
    convo.addMessage(menuMessage);

  });
});


module.exports = functions.https.onRequest(app);
