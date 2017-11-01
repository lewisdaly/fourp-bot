const moment = require('moment');

const api = require('../api');
const { scriptForLanguage, shouldSkipResponse } = require('../util');
const { generateButtonsForTemplate } = require('../format');
const { DEFAULT_EVENT } = require('../const');

module.exports = (controller, scripts) => {
  controller.hears(scripts.eng.recordDate.trigger, DEFAULT_EVENT, (bot, message) => {
    const script = scriptForLanguage(scripts, message.user_profile.language);

    bot.startConversation(message, (err, convo) => {
      let location = null;
      let date = null;
      let isDelayed = null;

      convo.addQuestion(script.recordDate.intro, (response, convo) => convo.gotoThread('q1'));

      const q1Handler = (response, convo) => {
        if (!response.text) {
          return;
        }

        location = response.text;
        return convo.gotoThread('q2');
      }
      convo.addQuestion(script.recordDate.question_1, q1Handler, {}, 'q1');

      const q2Handler = (response, convo) => {
        if (!response.text) {
          return;
        }

        date = response.text;
        return convo.gotoThread('q3');
      }
      convo.addQuestion(script.recordDate.question_2, q2Handler, {}, 'q2');

      const q3Handler = (response, convo) => {
        if (!response.text) {
          return;
        }

        isDelayed = response.text;
        return api.recordDate({
          location,
          date,
          isDelayed,
          recorded_at: moment().format(),
          user_id: message.user_profile.id,
          first_name: message.user_profile.first_name,
          last_name: message.user_profile.last_name,
        })
        .then(message => convo.gotoThread('end'));
      }
      convo.addQuestion(script.recordDate.question_3, q3Handler, {}, 'q3');

      convo.addMessage(script.recordDate.reply,'end');
      const menuMessage = {
        attachment: {
          type: "template",
          payload: generateButtonsForTemplate(script.menu.buttons)
        }
      };
      convo.addMessage(menuMessage, 'end');
    });
  });
}
