const { formatRepliesForOptions } = require('../format');
const { saveUserProperties } = require('../api');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {
  const commonScript = controller.commonScript.introduction;
  let language = null;
  let phoneNumber = null;

  // this is triggered when a user clicks the send-to-messenger plugin
  // controller.on('facebook_optin', function(bot, message) {
  //
  //     bot.reply(message, 'Welcome to my app!');
  //
  // });

  controller.hears(['getStarted', 'Hi', 'hi'], DEFAULT_EVENT, (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      convo.say(commonScript.intro.replace('__first_name__', message.user_profile.first_name));

      const q1_replies = formatRepliesForOptions(commonScript.question_1.options);
      convo.addQuestion({
        text: commonScript.question_1.text,
        quick_replies: q1_replies
      }, (response, convo) => {
        if (!response.quick_reply || !response.quick_reply.payload) {
          return
        }

        language = response.quick_reply.payload;
        convo.gotoThread(language);
      });

      //Build a separate thread for each langauge.
      Object.keys(commonScript.threads).forEach(key => {
        convo.addMessage(commonScript.threads[key].progress, key);
        convo.addQuestion({text:commonScript.threads[key].phone_number}, (response, convo) => {
          if (!response.text) {
            return;
          }

					//TODO: validate phone number input
          message.user_profile.phone_number = response.text;
          message.user_profile.language = key;
					return saveUserProperties(controller, message.user_profile)
					.then(() => convo.next());
        }, {}, key);

        convo.addQuestion({
          text: commonScript.threads[key].thanks,
          quick_replies: [
            {
              content_type: "text",
              title: commonScript.threads[key].quick_reply_title,
              payload: commonScript.threads[key].redirect_to
            }
          ],
        }, null, {}, key);
      });
    });
  });

};
