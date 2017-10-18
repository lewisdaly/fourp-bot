

const DEFAULT_EVENT = 'message_received,facebook_postback';

module.exports = (controller, script) => {

  // this is triggered when a user clicks the send-to-messenger plugin
  // controller.on('facebook_optin', function(bot, message) {
  //
  //     bot.reply(message, 'Welcome to my app!');
  //
  // });

  //TODO: Setup languages
  controller.hears('getStarted', DEFAULT_EVENT, (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      convo.say('Hi! I\'m 4PBot!');


    });
  });

};
