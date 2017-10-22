const api = require('../api');
const { scriptForLanguage, shouldSkipResponse } = require('../util');
const { generateButtonsForTemplate } = require('../format');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {
  controller.hears(scripts.eng.report.trigger, DEFAULT_EVENT, (bot, message) => {
    const script = scriptForLanguage(scripts, message.user_profile.language);

    bot.startConversation(message, (err, convo) => {
      let description = null;
      let reportType = null;
      let zipCode = null;

      convo.ask(`${script.report.intro}\n\n${script.report.statement_1}`, (response, convo) => {
        convo.gotoThread('q1');
      });

      //TODO: refactor to common class
      const q1_replies = script.report.question_1.options.map(option => {
        return {
          content_type: 'text',
          title: option.text,
          payload: option.payload
        };
      });
      const optionsQ1 = script.report.question_1.options.map(option => option.text);
      const handlerQ1 = (response, convo) => {
        if (shouldSkipResponse(response)) {
          return;
        }

        if (response.quick_reply && response.quick_reply.payload) {
          //TODO: this is just the index, we need the actual text
          reportType = response.quick_reply.payload;
          return convo.gotoThread('q2');
        }

        if (response.text) {
          //If the question is out of bounds, repeat!
          if (optionsQ1.indexOf(response.text) === -1) {
            console.log("Convo Error: response was not in range")
            return convo.gotoThread('q1');
          }

          reportType = response.text;
          return convo.gotoThread('q2');
        }
      }
      convo.addQuestion({text:script.report.question_1.text, quick_replies: q1_replies}, handlerQ1, {}, 'q1');

      convo.addQuestion({
      	text: script.report.question_2.text
      },
      (response, convo) => {
        if(shouldSkipResponse(response)) {
          return;
        }

        //We aren't bothering to validate this just yet
        zipCode = response.text;
        return convo.gotoThread('q3');

      }, {}, 'q2');

      convo.addQuestion({text: script.report.question_3.text}, (response, convo) => {
        if (response.text) {
          description = response.text;

          return api.report({
            user_id: message.user_profile.id,
            first_name: message.user_profile.first_name,
            last_name: message.user_profile.last_name,
            phone_number: message.user_profile.phone_number,
            langauge: message.user_profile.langauge,
            report_type: reportType,
            description: description,
            address: "N/A",
            country: "N/A",
            zip: zipCode,
          })
          .then(message => convo.gotoThread('end'));
        }
      }, {}, 'q3');

      convo.addMessage({text:script.report.reply}, 'end');
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
