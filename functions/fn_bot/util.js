
const scriptForLanguage = (script, language) => {
	if (!language) {
		console.error("ERROR: language is not set for user.");
		language = 'tgl';
	}
  //the way this works may change later on.
  return script[language];
}

const shouldSkipResponse = (response) => {
	if (response.type === 'message_received') {
		return false;
	}

	if (response.type === 'facebook_postback') {
		return false;
	}

	return true;
}

/**
 * Using this call will allow us to create and consume consistent logs
 */
const logEvent = ({code, message}) => {
	console.log(JSON.stringify({
		code,
		message
	}));
}

module.exports = {
	logEvent,
  scriptForLanguage,
	shouldSkipResponse,
}
