const api = require('../api');
const { formatRepliesForOptions } = require('../format');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, script) => {
  controller.hears(script.calculate.trigger, DEFAULT_EVENT, (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      let expectingBaby = null;
      let youngChildren = null;
      let elementaryChildren = null;
      let highChildren = null;

      const q1_replies = formatRepliesForOptions(script.calculate.question_1.options);
      convo.addQuestion({text:script.calculate.question_1.text, quick_replies: q1_replies}, (response, convo) => {
        if (response.text) {
          expectingBaby = response.text;
          convo.next();
        }
      });
      const q2_replies = formatRepliesForOptions(script.calculate.question_2.options);
      convo.addQuestion({text:script.calculate.question_2.text, quick_replies: q2_replies}, (response, convo) => {
        if (response.text) {
          youngChildren = response.text;
          convo.next();
        }
      });

      const q3_replies = formatRepliesForOptions(script.calculate.question_3.options);
      convo.addQuestion({text:script.calculate.question_3.text, quick_replies: q3_replies}, (response, convo) => {
        if (response.text) {
          elementaryChildren = response.text;
          convo.next();
        }
      });

      const q4_replies = formatRepliesForOptions(script.calculate.question_4.options);
      convo.addQuestion({text:script.calculate.question_4.text, quick_replies: q4_replies}, (response, convo) => {
        if (response.text) {
          highChildren = response.text;

          return api.calculatePay({
            expecting_baby: expectingBaby,
            young_children: youngChildren,
            elementary_school_children: elementaryChildren,
            high_school_children: highChildren,
            //TODO: get language
            language: 'ceb'
          })
          .then(messages => {
            //TODO: find a better method, we iterate backwards to get in the correct order
            for (var i = messages.length -1; i >= 0; i--) {
              convo.sayFirst(messages[i].text);
            };
            convo.next();
          });
        }
      });

      convo.say(script.calculate.reply);

      //Maybe this could be a convo.end
      convo.ask({text: script.menu_button.text, quick_replies: [
          {
            content_type: "text",
            title: script.menu_button.quick_reply_title,
            payload: script.menu_button.redirect_to
          }
        ]
      });
      convo.activate();
    });
  });
}
