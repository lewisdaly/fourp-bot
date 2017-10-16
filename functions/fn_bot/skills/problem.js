const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, script) => {

  controller.hears(['cookies'], 'message_delivered', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        });
    });
  });


  //eww so much nesting
  controller.hears(script.problem.trigger, DEFAULT_EVENT, (bot, message) => {
    bot.startConversation(message, function(err, convo) {
      //TODO: somehow separate into 2 messages
      convo.say(`${script.problem.intro}\n\n${script.problem.statement_1}`);

      const q1_replies = script.problem.question_1.options.map(option => {
        return {
          content_type: 'text',
          title: option.text,
          payload: option.payload
        };
      });

      convo.addQuestion({text:script.problem.question_1.text, quick_replies: q1_replies}, (response, convo) => {

        console.log(response);
        if (response.text) {
          convo.next();
        }

      });

      //TODO: only ask if we don't already have this info
      convo.addQuestion({text:script.problem.question_2.text}, (response, convo) => {
        console.log(response);

        if (response.text) {
          convo.next();
        }
      });

      convo.addQuestion({text:script.problem.question_3.text}, (response, convo) => {
        console.log(response);
        if (response.text) {
          convo.next();
        }
      });

      //TODO: api request, submit to Zapier
      convo.say(script.problem.reply);

      //Maybe this could be a convo.end
      convo.ask({text: script.problem.menu_button.text, quick_replies: [
          {
            content_type: "text",
            title: script.problem.menu_button.quick_reply_title,
            payload: script.problem.menu_button.redirect_to
          }
        ]
      });
      convo.activate();
    });
  });
}
