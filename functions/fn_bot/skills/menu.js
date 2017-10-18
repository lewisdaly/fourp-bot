const { scriptForLanguage } = require('../util');
const { generateButtonsForTemplate } = require('../format');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {

  controller.hears([scripts.eng.menu.trigger, 'Menu'], DEFAULT_EVENT, (bot, message) => {
    const script = scriptForLanguage(scripts, message.user_profile.language);
    bot.startConversation(message, function(err, convo) {
        convo.say(script.menu.intro);

        var msg = {
          attachment: {
            type: "template",
            payload: generateButtonsForTemplate(script.menu.buttons)
          }
        };
        convo.say(msg);
    });
  });

  controller.on('facebook_postback', function(bot, message) {
    console.log("FACEBOOK POSTBACK");
  });
};
