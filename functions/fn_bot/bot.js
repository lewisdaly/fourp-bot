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
} = require('../common/env')(functions);

const storage = FirebaseStorage({firebase_uri});
const controller = Botkit.facebookbot({
    verify_token,
    access_token: page_access_token,
    studio_token,
    studio_command_uri,
    storage,
});

const fbuser = FBUser({
    accessToken: page_access_token,
    fields: [
			'first_name',
			'last_name',
			'locale',
			'profile_pic',
			'timezone',
			'gender',
			'address',
			'religion'
		],
    logLevel: 'debug',
    expire: 7 * 24 * 60 * 60 * 1000, // refresh profile info every week
    storage
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
	//TODO: don't use implicit shit like this.
	if (!message.user_profile.language) {

    const commonScript = controller.commonScript.introduction;
	  // start a conversation to handle this response.
	  return bot.startConversation(message, (err,convo) => {
	    convo.say(commonScript.intro.replace('__first_name__', message.user_profile.first_name));
      convo.say(commonScript.intro_hi);
    });
	}

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
