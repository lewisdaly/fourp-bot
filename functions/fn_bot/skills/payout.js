const api = require('../api');
const { scriptForLanguage, shouldSkipResponse } = require('../util');
const { showMenu } = require('../format');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {
  controller.hears('payout', DEFAULT_EVENT, (bot, message) => {
    console.log("message:", message);

    const script = scriptForLanguage(scripts, message.user_profile.language);

    bot.startConversation(message, (err, convo) => {
      convo.say(script.payout.intro);
      convo.say(script.payout.statement_1);
      convo.say(script.payout.statement_2);

      //TODO: conditionally ask this question (v0.2)

      const handlerQ1 = (response, convo) => {
        if(shouldSkipResponse(response)) {
          return;
        }

        const payload = {
          zip_code: response.text,
          language: message.user_profile.language
        };

        return api.getPayout(payload)
        .then(message => {
          convo.sayFirst(message.text);
          convo.next();
        })
        .catch(err => {
          console.log("error", err);
        });
      };

      convo.addQuestion({text: script.payout.button}, handlerQ1, {}, 'default');
      showMenu(convo, script);
    });
  });
}
