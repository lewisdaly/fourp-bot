const { formatRepliesForOptions, generateButtonsForTemplate } = require('../format');
const { saveUserProperties } = require('../api');
const { getRandomElement, logEvent, nextHandler, scriptForLanguage, shouldSkipResponse } = require('../util');
const { CONVO_END, CONVO_START, DEFAULT_EVENT } = require('../const');

module.exports = (controller, scripts) => {
  controller.hears(['talk'], DEFAULT_EVENT, (bot, message) => {
    logEvent({code: CONVO_START});

    const script = scriptForLanguage(scripts, message.user_profile.language);

    bot.createConversation(message, (err, convo) => {
      convo.setTimeout(1000 * 60 * 5); //5 minutes

      const endOrContinueMessage = {
        text: script.talk.keep_talking,
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
        ]
      };

      let responseCount = 0;
      const waitOrRepeatHandler = [
        {
          pattern: /menu|done/i,
          //End the conversation
          callback: (response, convo) => {
            console.log("done called");
            bot.reply(convo.source_message, script.talk.end);
            return convo.next();
          }
        },
        {
          pattern: /keep|talking/i,
          callback: (response, convo) => {
            console.log("keep talking called");
            return convo.silentRepeat();
          }
        },
        {
          default: true,
          callback: (response, convo) => {
            if (shouldSkipResponse(response)) {
              return;
            }

            responseCount += 1;

            if (responseCount % 3 === 0) {
              bot.reply(convo.source_message, endOrContinueMessage);
              return convo.silentRepeat();
            }

            bot.reply(convo.source_message, getRandomElement(script.talk.responses));
            return convo.silentRepeat();
          }
        }
      ];

      convo.addQuestion(script.talk.intro, waitOrRepeatHandler, {}, 'default');
      convo.addMessage({text:script.menu_button.text});
      const menuMessage = {
        attachment: {
          type: "template",
          payload: generateButtonsForTemplate(script.menu.buttons)
        }
      };
      convo.addMessage(menuMessage);

      convo.onTimeout(convo => {
        logEvent({code: CONVO_TIMEOUT});
        convo.next();
      });

      convo.on('end', () => {
        logEvent({code: CONVO_END});
      })

      convo.activate();
    });
  });
}
