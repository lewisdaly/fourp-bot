

const showMenu = (bot, message, convo, script) => {
//   convo.on('end', (convo) => {
//     console.log("ENDING CONVO");
//     bot.reply(message, {text: script.menu_button.text, quick_replies: [
//       {
//         content_type: "text",
//         title: script.menu_button.quick_reply_title,
//         payload: script.menu_button.redirect_to
//       }]
//     });
//   });
};

const formatRepliesForOptions = (options) => {
  return options.map(option => {
    return {
      content_type: 'text',
      title: option.text,
      payload: option.payload
    };
  });
}

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

module.exports = {
  formatRepliesForOptions,
	generateButtonsForTemplate,
	showMenu
};
