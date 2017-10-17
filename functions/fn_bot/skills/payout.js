const api = require('../api');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, script) => {

  controller.hears(script.payout.trigger, DEFAULT_EVENT, (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      convo.say(script.payout.intro);
      convo.say(script.payout.statement_1);
      convo.say(script.payout.statement_2);

      //TODO: conditionally ask this question (0.2)

      convo.addQuestion({
      	text: script.payout.button,
      	quick_replies:[{ content_type:'location' }]
      }, (response, convo) => {
        if (response.attachments) {
          const latLng = {
        		lat: response.attachments[0].payload.coordinates.lat,
        		lng: response.attachments[0].payload.coordinates.long
        	};

          const payload = {latLng};
          //TODO: we should simulate typing here, as a loading indicator
          return api.getPayout(payload)
          .then(message => {
            convo.sayFirst(message.text);
            convo.next();
          });
        }
      }, {key: 'location'}, 'default');

      convo.ask({text: script.menu_button.text, quick_replies: [
          {
            content_type: "text",
            title: script.menu_button.quick_reply_title,
            payload: script.menu_button.redirect_to
          }
        ]
      });
    });
  });
}
