const api = require('../api');
const { scriptForLanguage } = require('../util');

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

        //Maybe this could be a convo.end
        convo.ask({text: script.news.menu_button.text, quick_replies: [
            {
              content_type: "text",
              title: script.news.menu_button.quick_reply_title,
              payload: script.news.menu_button.redirect_to
            }
          ]
        });
        convo.activate();
      });
    });
  });
}
