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

      const handler = (response, convo) => {
        convo.gotoThread('q1');
      };
      convo.addQuestion(script.payout.statement_2, handler, {}, 'default');
      // convo.gotoThread('q1');

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
          convo.gotoThread('end');
        })
        .catch(err => {
          console.log("error", err.error);
          //TODO: better error handling.
					convo.sayFirst(err.error);
          convo.gotoThread('q1');
        });
      };

      convo.addQuestion({text: script.payout.button}, handlerQ1, {}, 'q1');
      showMenu(bot, message, convo, script);

      conovo.addQuestion({text: script.menu_button.text, quick_replies: [
        {
          content_type: "text",
          title: script.menu_button.quick_reply_title,
          payload: script.menu_button.redirect_to
        }]
      }, null, {}, 'end');

    });
  });
}
