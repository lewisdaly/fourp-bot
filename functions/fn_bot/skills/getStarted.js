var PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const { formatRepliesForOptions } = require('../format');
const { saveUserProperties } = require('../api');
const { shouldSkipResponse } = require('../util');

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, scripts) => {
  const commonScript = controller.commonScript.introduction;
  let language = null;
  let phoneNumber = null;

  controller.hears(['question'], 'message_received', function(bot,message) {

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
          convo.sayFirst('you chose Tagalog');
          language = 'tgl';
          convo.gotoThread(language);
        }
      },
      {
        pattern: 'ceb',
        callback: function(response,convo) {
          convo.sayFirst('you chose Cebuano');
          language = 'ceb';
          convo.gotoThread(language);
        }
      },
      {
        pattern: 'eng',
        callback: function(response,convo) {
          convo.sayFirst('you chose English');
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
              phoneNumber = phoneUtil.parse(response.text, 'PHL');
              console.log(phoneUtil.format(phoneNumber, PNF.INTERNATIONAL));
            } catch (err) {
              console.log("error with number:", err);
              convo.sayFirst('That does not look like a phone number');
              convo.repeat();
              convo.next();
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


      // //Error handler for phone number
      // convo.addMessage({
      //   text: 'Sorry I did not understand. That doesn\'t look like a phone number', action: key,
      // },'phone_validation');



      // convo.addQuestion({
      //   text: commonScript.threads[key].thanks,
      //   quick_replies: [
      //     {
      //       content_type: "text",
      //       title: commonScript.threads[key].quick_reply_title,
      //       payload: commonScript.threads[key].redirect_to
      //     }
      //   ],
      // }, null, {}, key);
    // });

    //TODO: display menu

  });
});

  // this is triggered when a user clicks the send-to-messenger plugin
  // controller.on('facebook_optin', function(bot, message) {
  //
  //     bot.reply(message, 'Welcome to my app!');
  //
  // });

  controller.hears(['getStarted', 'Hi', 'hi'], DEFAULT_EVENT, (bot, message) => {
    bot.startConversation(message, (err, convo) => {

      //TODO: rediect elsewhere.
      convo.addMessage({text: 'Enter tgl, ceb or eng', action: 'default'},'language_validation');

      convo.say(commonScript.intro.replace('__first_name__', message.user_profile.first_name));

      const q1_replies = formatRepliesForOptions(commonScript.question_1.options);
      convo.addQuestion({
        text: commonScript.question_1.text,
        quick_replies: q1_replies
      }, (response, convo) => {

				if (response.quick_reply && reponse.quick_reply.payload()) {
					langauge = response.quick_reply.payload;
				} else if (response.text) {
					//TODO check that text matches payload, otherwise ask question again.
					const validResponses = commonScript.question_1.options.map(options => options.payload);
          if (validResponses.indexOf(response.text) < 0) {
            return convo.gotoThread('language_validation');
          }

          language = response.text;
				} else {
					return;
				}

        convo.gotoThread(language);
      });


    });
  });

};
