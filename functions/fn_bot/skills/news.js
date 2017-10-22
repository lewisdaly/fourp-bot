const api = require('../api');
const { scriptForLanguage } = require('../util');
const { generateButtonsForTemplate } = require('../format');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {
  controller.hears(scripts.eng.news.trigger, DEFAULT_EVENT, (bot, message) => {
    const script = scriptForLanguage(scripts, message.user_profile.language);

    //TODO: get user language
    return api.getNewsForLanguage(message.user_profile.language)
    .then(news => {
      bot.startConversation(message, (err, convo) => {
        convo.say(`${script.news.intro}`);

        news.messages.forEach(item => {
          //These aren't actual questions, but to get working
          convo.addQuestion({text:item.text}, (response, convo) => convo.next());
        });

        convo.addMessage({text:script.menu_button.text});
        const menuMessage = {
          attachment: {
            type: "template",
            payload: generateButtonsForTemplate(script.menu.buttons)
          }
        };
        convo.addMessage(menuMessage);
      });
    });
  });
}
