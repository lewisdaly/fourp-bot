const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, script) => {
  //eww so much nesting
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
      	// var obj = {
      	// 	lat: response.attachments[0].payload.coordinates.lat,
      	// 	lon: response.attachments[0].payload.coordinates.long
      	// }
      	// response.text = JSON.stringify(obj);

        console.log('location is: ', response);
      	convo.next();
      }, {key: 'location'}, 'default');

      //TODO: api request
      convo.say(script.payout.reply);

      //Maybe this could be a convo.end
      convo.ask({text: script.payout.menu_button.text, quick_replies: [
          {
            content_type: "text",
            title: script.payout.menu_button.quick_reply_title,
            payload: script.payout.menu_button.redirect_to
          }
        ]
      });
    });
  });
}
