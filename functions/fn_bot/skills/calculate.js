const api = require('../api');
const { formatRepliesForOptions, generateButtonsForTemplate } = require('../format');
const { scriptForLanguage } = require('../util');
const { DEFAULT_EVENT } = require('../const');

module.exports = (controller, scripts) => {
  controller.hears(scripts.eng.calculate.trigger, DEFAULT_EVENT, (bot, message) => {
    const script = scriptForLanguage(scripts, message.user_profile.language);

	    bot.startConversation(message, (err, convo) => {
	      let expectingBaby = null;
	      let youngChildren = null;
	      let elementaryChildren = null;
	      let highChildren = null;

				convo.say(script.calculate.intro);

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
	            language: message.user_profile.language
	          })
	          .then(messages => {
	            //TODO: find a better method, we iterate backwards to get in the correct order
	            for (var i = messages.length -1; i >= 0; i--) {
	              convo.sayFirst(messages[i]);
	            };
	            convo.next();
	          });
	        }
	      });

	      convo.say(script.calculate.reply);

        const menuMessage = {
          attachment: {
            type: "template",
            payload: generateButtonsForTemplate(script.menu.buttons)
          }
        };
        convo.addMessage(menuMessage);
    });
  });
}
