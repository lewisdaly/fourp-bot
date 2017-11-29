const { formatRepliesForOptions, generateButtonsForTemplate } = require('../format');
const { saveUserProperties } = require('../api');
const { scriptForLanguage, shouldSkipResponse } = require('../util');
const { DEFAULT_EVENT } = require('../const');

module.exports = (controller, scripts) => {
  const script = scriptForLanguage(scripts, message.user_profile.language);

  controller.hears(['talk'], DEFAULT_EVENT, (bot, message) => {
    bot.createConversation(message, (err, convo) => {

      const waitOrRepeatHandler = [
        {
          default: true,
          callback: (response, convo) => {
            if (shouldSkipResponse(response)) {
              return;
            }

            return convo.next();
          }
        }
      ];

      //Add a done button?
      convo.addQuestion({
        text: script.talk.intro,
        quick_replies: [
          {
            content_type: "text",
            title: script.talk.done,
            payload: 'menu'
          },
          {
            content_type: "text",
            title: script.talk.continue,
            payload: 'menu'
          }
        ],
      }, waitOrRepeatHandler, {}, 'default');

    });
  });
}
