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

      convo.ask(script.recordDate, (response, convo) => convo.gotoThread('q1'));

      const q1Handler = (response, convo) => {
        if (!response.text) {
          return;
        }

        location = response.text;
        return convo.gotoThread('q2');
      }
      convo.ask('Where do you live?', q1Handler, {}, 'q1');

      const q2Handler = (response, convo) => {
        if (!response.text) {
          return;
        }

        date = response.text;
        return convo.gotoThread('q3');
      }
      convo.ask('What date was the payout?', q2Handler, {}, 'q2');

      const q3Handler = (response, convo) => {
        if (!response.text) {
          return;
        }

        isDelayed = response.text;
        return api.recordDate({
          location,
          date,
          isDelayed
        })
        .then(message => convo.gotoThread('end'));
      }
      convo.ask('Was this payout delayed?', q3Handler, {}, 'q3');

    });
  });
}
