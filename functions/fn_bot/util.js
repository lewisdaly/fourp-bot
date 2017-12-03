
const getRandomElement = (array) => {
	return array[Math.floor(Math.random()*array.length)];
}

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

/**
 * A default handler that just calls convo.next() after a response
 */
const nextHandler = (response, convo) => {
	if (shouldSkipResponse(response)) {
		return;
	}

	return convo.next();
}

module.exports = {
	getRandomElement,
	logEvent,
	nextHandler,
  scriptForLanguage,
	shouldSkipResponse,
}
