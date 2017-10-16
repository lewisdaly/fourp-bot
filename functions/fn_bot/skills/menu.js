module.exports = (controller, script) => {
  //TODO: move to facebook template interface
  const generateButtonsForTemplate = (buttons) => {
    const elements = buttons.map(button => {
      return {
        title: button.title,
        subtitle: button.subtitle,
        buttons: [
          {
            type: 'postback',
            title: button.button_title,
            payload: button.redirect_to
          }
        ],
      };
    });

    return {
      template_type:'generic',
      elements: elements
    };
  };

  controller.hears(script.menu.trigger, 'message_received', (bot, message) => {
    bot.startConversation(message, function(err, convo) {
        convo.say(script.menu.intro);
        //TODO: proper adapter!
        var msg = {
          attachment: {
            type: "template",
            payload: generateButtonsForTemplate(script.menu.buttons)
          }
        };
        convo.say(msg);
    });
  });

  //subscribe to button postbacks, not sure if this will work -
  //nope - we cannot redirect to another thread programatically

  // script.menu.buttons.forEach(button => {
  //   const event = 'message_received,facebook_postback';
  //   controller.hears(button.payload, event, (bot, message) => {
  //     bot.reply(message, button.payload);
  //   });
  // });


  controller.hears('test1','message_received,facebook_postback', (bot,message) => {
    //TODO: route to stuff
    bot.reply(message, 'Got it!');

  });

	controller.hears('test', 'message_received', function(bot, message) {
    var attachment = {
        'type':'template',
        'payload':{
            'template_type':'generic',
            'elements':[
                {
                    'title':'Chocolate Cookie',
                    'image_url':'http://cookies.com/cookie.png',
                    'subtitle':'A delicious chocolate cookie',
                    'buttons':[
                        {
                        'type':'postback',
                        'title':'Eat Cookie',
                        'payload':'chocolate'
                        }
                    ]
                },
            ]
        }
    };

    bot.reply(message, {
        attachment: attachment,
    });

});

controller.on('facebook_postback', function(bot, message) {

    if (message.payload == 'chocolate') {
        bot.reply(message, 'You ate the chocolate cookie!')
    }

});


    controller.hears(['color'], 'message_received', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            convo.say('This is an example of using convo.ask with a single callback.');

            convo.ask('What is your favorite color?', function(response, convo) {

                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();

            });
        });

    });


    controller.hears(['question'], 'message_received', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            // create a path for when a user says YES
            convo.addMessage({
                    text: 'How wonderful.',
            },'yes_thread');

            // create a path for when a user says NO
            // mark the conversation as unsuccessful at the end
            convo.addMessage({
                text: 'Cheese! It is not for everyone.',
                action: 'stop', // this marks the converation as unsuccessful
            },'no_thread');

            // create a path where neither option was matched
            // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
            convo.addMessage({
                text: 'Sorry I did not understand. Say `yes` or `no`',
                action: 'default',
            },'bad_response');

            // Create a yes/no question in the default thread...
            convo.ask('Do you like cheese?', [
                {
                    pattern:  bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.gotoThread('yes_thread');
                    },
                },
                {
                    pattern:  bot.utterances.no,
                    callback: function(response, convo) {
                        convo.gotoThread('no_thread');
                    },
                },
                {
                    default: true,
                    callback: function(response, convo) {
                        convo.gotoThread('bad_response');
                    },
                }
            ]);

            convo.activate();

            // capture the results of the conversation and see what happened...
            convo.on('end', function(convo) {

                if (convo.successful()) {
                    // this still works to send individual replies...
                    bot.reply(message, 'Let us eat some!');

                    // and now deliver cheese via tcp/ip...
                }

            });
        });

    });

};
