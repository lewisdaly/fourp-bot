const api = require('../api');
const { scriptForLanguage } = require('../util');
const { generateButtonsForTemplate } = require('../format');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {
  controller.hears(scripts.eng.feedback.trigger, DEFAULT_EVENT, (bot, message) => {
    const script = scriptForLanguage(scripts, message.user_profile.language);

    bot.startConversation(message, (err, convo) => {
      let score = null;
      let improved = null;
      let features = null;

      const q1_replies = script.feedback.question_1.options.map(option => {
        return {
          content_type: 'text',
          title: option.text,
          payload: option.payload
        };
      });

      convo.addQuestion({text:script.feedback.question_1.text, quick_replies: q1_replies}, (response, convo) => {
        if (response.text) {
          score = response.text;
          convo.next();
        }
      });

      convo.addQuestion({text:script.feedback.question_2}, (response, convo) => {
        if (response.text) {
          improved = response.text;
          convo.next();
        }
      });
      convo.addQuestion({text:script.feedback.question_3}, (response, convo) => {
        if (response.text) {
          features = response.text;

          api.leaveFeedback({
            firstName: message.user_profile.first_name,
            lastName: message.user_profile.last_name,
            userId: message.user_profile.id,
            language: message.user_profile.language,
            score: score,
            improved: improved,
            features: features,
          });

          convo.next();
        }
      });


      convo.say(script.feedback.reply);

      //Maybe this could be a convo.end
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
