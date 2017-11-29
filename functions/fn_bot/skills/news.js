const api = require('../api');
const { logEvent, scriptForLanguage } = require('../util');
const { generateButtonsForTemplate } = require('../format');
const { CONVO_END, CONVO_START, DEFAULT_EVENT } = require('../const');


module.exports = (controller, scripts) => {
  controller.hears(scripts.eng.news.trigger, DEFAULT_EVENT, (bot, message) => {
    logEvent({code: CONVO_START});

    const script = scriptForLanguage(scripts, message.user_profile.language);

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

        convo.on('end', () => {
          logEvent({code: CONVO_END});
        })
      });
    });
  });
}
