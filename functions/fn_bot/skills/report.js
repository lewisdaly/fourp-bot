const api = require('../api');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, script) => {
  controller.hears(script.report.trigger, DEFAULT_EVENT, (bot, message) => {

    bot.startConversation(message, (err, convo) => {
      let description = null;
      let reportType = null;
      let lat = null;
      let lng = null;

      convo.say(`${script.report.intro}\n\n${script.report.statement_1}`);

      //TODO: refactor to common class
      const q1_replies = script.report.question_1.options.map(option => {
        return {
          content_type: 'text',
          title: option.text,
          payload: option.payload
        };
      });

      convo.addQuestion({text:script.report.question_1.text, quick_replies: q1_replies}, (response, convo) => {
        if (response.text) {

          reportType = response.quick_reply.payload;
          convo.next();
        }
      });

      convo.addQuestion({
      	text: script.report.question_2.text,
      	quick_replies:[{ content_type:'location' }]
      },
      (response, convo) => {
        if (response.attachments) {
          lat = response.attachments[0].payload.coordinates.lat;
          lng = response.attachments[0].payload.coordinates.long;

          convo.next();
        }
      }, {key: 'location'}, 'default');

      convo.addQuestion({text: script.report.question_3.text}, (response, convo) => {
        if (response.text) {
          description = response.text;

          return api.report({
            user_id: "N/A",
            first_name: "N/A",
            last_name: "N/A",
            phone_number: "N/A",
            langauge: "N/A",
            report_type: reportType,
            description: description,
            lat: lat,
            lng: lng,
            address: "N/A",
            country: "N/A",
            zip: "N/A",
          })
          .then(message => convo.next());
        }
      });

      convo.say(script.report.reply);
      convo.ask({text: script.report.menu_button.text, quick_replies: [
          {
            content_type: "text",
            title: script.report.menu_button.quick_reply_title,
            payload: script.report.menu_button.redirect_to
          }
        ]
      });

    });
  });
}
