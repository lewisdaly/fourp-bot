var PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const { formatRepliesForOptions } = require('../format');
const { saveUserProperties } = require('../api');
const { shouldSkipResponse } = require('../util');
const { DEFAULT_EVENT } = require('../const');

module.exports = (controller, scripts) => {
  const commonScript = controller.commonScript.introduction;
  let language = null;
  let phoneNumber = null;

	controller.hears(['getStarted', 'Hi', 'hi'], DEFAULT_EVENT, (bot, message) => {

	  // start a conversation to handle this response.
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
	      convo.addMessage(commonScript.threads[key].progress, key);

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
                const rawNumber = response.text.replace(/\b0/g, '+63');
	              phoneNumber = phoneUtil.parse(rawNumber, 'PHL');
	              console.log(phoneUtil.format(phoneNumber, PNF.INTERNATIONAL));
	            } catch (err) {
                console.error("ERROR parsing phone number: ", response.text);
	              convo.sayFirst(commonScript.threads[key].phone_number_error);

	              // convo.repeat();
	              // convo.next();
								//TODO: For some reson, convo.repeat() first goes to the menu, and then repeats the question.
								//This is a quick fix for now, but we will need to resolve it later.
								convo.gotoThread(key);

								return;
	            }

	            message.user_profile.phone_number = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
	            message.user_profile.language = key;
	            return saveUserProperties(controller, message.user_profile)
	            .then(() => convo.next());
	          }
	        }
	      ];

	      convo.addQuestion(question2, handlerQ2, {}, key);
	      //TODO: load the actual menu.
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
