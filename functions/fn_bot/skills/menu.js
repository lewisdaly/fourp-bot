const { scriptForLanguage } = require('../util');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {
  //TODO: move to facebook template interface
  const generateButtonsForTemplate = (buttons) => {
    const elements = buttons.map(button => {
      return {
        title: button.title,
        subtitle: button.subtitle,
        buttons: [
          {
            type: 'postback',
            title: button.button_title,
            payload: button.redirect_to
          }
        ],
      };
    });

    return {
      template_type:'generic',
      elements: elements
    };
  };

  controller.hears([scripts.eng.menu.trigger, 'Menu'], DEFAULT_EVENT, (bot, message) => {
    const script = scriptForLanguage(scripts, message.user_profile.language);
    bot.startConversation(message, function(err, convo) {
      convo.say(script.menu.intro);

      //TODO: proper adapter!
      var msg = {
        attachment: {
          type: "template",
          payload: generateButtonsForTemplate(script.menu.buttons)
        }
      };
      convo.say(msg);
    });
  });
};
