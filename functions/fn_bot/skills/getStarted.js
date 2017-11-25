var PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const { formatRepliesForOptions, generateButtonsForTemplate } = require('../format');
const { saveUserProperties } = require('../api');
const { scriptForLanguage, shouldSkipResponse } = require('../util');
const { DEFAULT_EVENT } = require('../const');

module.exports = (controller, scripts) => {
  const commonScript = controller.commonScript.introduction;
  let language = null;
  let phoneNumber = null;

	controller.hears(['getStarted', 'HELLO', 'hello'], DEFAULT_EVENT, (bot, message) => {

    if (message.user_profile.language) {
      console.warn('getStarted triggered, when langauge was already set.');
    }

	  // start the get started conversation
	  bot.startConversation(message, (err,convo) => {
	    convo.say(commonScript.intro.replace('__first_name__', message.user_profile.first_name));
	    const question = {
	      text: commonScript.question_1.text,
	      quick_replies: formatRepliesForOptions(commonScript.question_1.options)
	    };

	    const handlerQ1 = [
	      {
	        pattern: 'tgl',
	        callback: function(response,convo) {
	          language = 'tgl';
	          convo.gotoThread(language);
	        }
	      },
	      {
	        pattern: 'ceb',
	        callback: function(response,convo) {
	          language = 'ceb';
	          convo.gotoThread(language);
	        }
	      },
	      {
	        pattern: 'eng',
	        callback: function(response,convo) {
	          language = 'eng';
	          convo.gotoThread(language);
	        }
	      },
	      {
	        default: true,
	        callback: function(response, convo) {
	          if (shouldSkipResponse(response)) {
	            return;
	          }

	          if (response.quick_reply && response.quick_reply.payload) {
	            language = response.quick_reply.payload;
	            return convo.gotoThread(language);
	          }

	          //TODO: silentRepeat doesn't seem able to repeat endlessly
	          convo.repeat();
	          convo.next();
	        }
	      }
	    ];
	    convo.addQuestion(question, handlerQ1, {}, 'default');

	    //Build a separate thread for each langauge.
	    Object.keys(commonScript.threads).forEach(key => {
	      // convo.addQuestion(commonScript.threads[key].progress, (response, convo) => convo.gotoThread(key + '_number'), {}, key);

	      const question2 = {
	        text: commonScript.threads[key].phone_number
	      };

	      const handlerQ2 = [
	        {
	          default: true,
	          callback: function(response, convo) {
	            if (shouldSkipResponse(response)) {
	              return;
	            }

	            // Parse number with country code. - for now assume Philippines
	            let phoneNumber = null;
	            try {
                let rawNumber = response.text.replace(/\b0/g, '+63');
                if (response.text.toLowerCase().indexOf('skip') > -1) {
                  console.warn("user didn't provide number");
                  //just set a dummy number
                  rawNumber = '+63404404404';
                }

	              phoneNumber = phoneUtil.parse(rawNumber, 'PHL');
	              console.log(phoneUtil.format(phoneNumber, PNF.INTERNATIONAL));
	            } catch (err) {
                console.error("ERROR parsing phone number: ", response.text);
	              // convo.sayFirst(commonScript.threads[key].phone_number_error);
								// convo.next();

	              // convo.repeat();
	              // convo.next();
								//TODO: For some reson, convo.repeat() first goes to the menu, and then repeats the question.
								//This is a quick fix for now, but we will need to resolve it later.
								convo.gotoThread(key + '_error');

								return;
	            }

	            message.user_profile.phone_number = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
	            message.user_profile.language = key;
	            return saveUserProperties(controller, message.user_profile)
	            .then(() => convo.next());
	          }
	        }
	      ];

				const handlerQ2_error = [
					{
						default: true,
						callback: (response, convo) => {
							if (shouldSkipResponse(response)) {
	              return;
	            }

							return convo.gotoThread(key + '_number');
						}
					}
				];

	      convo.addQuestion(question2, handlerQ2, {}, key);
        convo.addMessage({
          text: commonScript.threads[key].phone_number_error,
          action: key + '_number',
        },key + '_error');
				// convo.addQuestion(commonScript.threads[key].phone_number_error, handlerQ2_error, {}, key + '_error');

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
