var PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const { formatRepliesForOptions, generateButtonsForTemplate } = require('../format');
const { saveUserProperties } = require('../api');
const { scriptForLanguage, shouldSkipResponse } = require('../util');
const { DEFAULT_EVENT } = require('../const');

module.exports = (controller, scripts) => {
  const commonScript = controller.commonScript.introduction;

	controller.hears(['getStarted', 'Get Started', 'hello', 'HELLO'], DEFAULT_EVENT, (bot, message) => {
		bot.createConversation(message, (err, convo) => {
      const userPropertiesToSave = {
        phone_number: '',
        language: ''
      };

			convo.addMessage(commonScript.intro, 'default');

      const question = {
	      text: commonScript.question_1.text,
	      quick_replies: formatRepliesForOptions(commonScript.question_1.options)
	    };

      //handle text
      const handlerQ1 = ['tgl', 'ceb', 'eng'].map(language => {
        return {
          pattern: language,
          callback: (response, convo) => {
            convo.setVar('threads', commonScript.threads[language]);
            message.user_profile.language = language;
            return saveUserProperties(controller, message.user_profile)
            .then(() => convo.next());

            return convo.next();
          }
        };
      });

      //Handle quick replies
      let languageQuestionFailureCount = 0;
      handlerQ1.push({
        default: true,
        callback: function(response, convo) {
          if (shouldSkipResponse(response)) {
            return;
          }

          if (response.quick_reply && response.quick_reply.payload) {
            const language = response.quick_reply.payload;
            convo.setVar('threads', commonScript.threads[language]);

            message.user_profile.language = language;
            return saveUserProperties(controller, message.user_profile)
            .then(() => convo.next());
          }

          languageQuestionFailureCount += 1;

          //If the user can't get this, default to tagalog
          if (languageQuestionFailureCount >= 2) {
            const language = 'tgl';

            convo.setVar('threads', commonScript.threads[language]);
            message.user_profile.language = language;
            return saveUserProperties(controller, message.user_profile)
            .then(() => convo.next());
            return convo.next();
          }

          //workaround for silentRepeat ending convo. Ref: https://github.com/howdyai/botkit/issues/318
          bot.reply(convo.source_message, commonScript.question_1.error);
          convo.silentRepeat();
        }
      });



	    convo.addQuestion(question, handlerQ1, {}, 'default');
      convo.addMessage('{{& vars.threads.progress}}.', 'default');

      let numberQuestionFailCount = 0;

      const handlerQ2 = [
        {
          pattern: /skip/i,
          callback: (response, convo) => convo.next(),
        },
        {
          default: true,
          callback: function(response, convo) {
            if (shouldSkipResponse(response)) {
              return;
            }

            //if user doesn't say skip, but fails 2 times, then skip
            //otherwise try and parse number
              // if fails, repeat and try again. increment the fail count

            let rawNumber = response.text.replace(/\b0/g, '+63');
            try {
              const phoneNumber = phoneUtil.parse(rawNumber, 'PHL');
              message.user_profile.phone_number = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);

            } catch (err) {
              console.error("ERROR parsing phone number: ", response.text);
              numberQuestionFailCount += 1;

              if (numberQuestionFailCount >= 2) {
                return convo.next();
              }

              //Can't use templates with this workaround
              const errorMessage = commonScript.threads[message.user_profile.language].phone_number_error;
              bot.reply(convo.source_message, errorMessage);

              return convo.silentRepeat();
            }

            return saveUserProperties(controller, message.user_profile)
            .then(() => convo.next());
          }
        }
      ];

      convo.addQuestion('{{& vars.threads.phone_number}}', handlerQ2, {}, 'default');
      // convo.addMessage('{{vars.threads.thanks}}', 'default');

      convo.addMessage({
        text: '{{vars.threads.thanks}}',
        quick_replies: [
          {
            content_type: "text",
            title: 'MENU',
            payload: 'menu'
          }
        ],
      }, null, {}, 'default');

	    convo.setVar('first_name', message.user_profile.first_name);
	    convo.activate();
		});

	});
}
