

const scriptForLanguage = (script, language) => {
	if (!language) {
		console.log("ERROR: language is not set for user.");
		langauge = 'tgl';
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

module.exports = {
  scriptForLanguage,
	shouldSkipResponse,
}
