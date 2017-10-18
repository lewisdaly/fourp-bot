

const scriptForLanguage = (script, language) => {
	if (!language) {
		console.log("ERROR: language is not set for user.");
		langauge = 'tgl';
	}
  //the way this works may change later on.
  return script[language];
}

module.exports = {
  scriptForLanguage
}
