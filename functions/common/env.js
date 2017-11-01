const env = require('node-env-file');

module.exports = (functions) => {
	console.log('node_env:', process.env.NODE_ENV);

  let verify_token = null;
  let page_access_token = null;
  let studio_token = null;
  let studio_command_uri = null;
  let firebase_uri = null;

  //TODO: not ideal. Don't infer, Lewis.
  // if (!functions.config().verify_token) {
  //   console.log("not running in firebase");
    env(__dirname + '/../common/.env_common');

    verify_token = process.env.verify_token;
    page_access_token = process.env.page_access_token;
    studio_token = process.env.studio_token;
    studio_command_uri = process.env.studio_command_uri;
    firebase_uri = process.env.firebase_uri;
  // } else {
  //   console.log("running in firebase");
  //
  //   verify_token = functions.config().fn_bot.verify_token;
  //   access_token = functions.config().fn_bot.access_token;
  //   studio_token = functions.config().fn_bot.studio_token;
  //   studio_command_uri = functions.config().fn_bot.studio_command_uri;
  //   firebase_uri = functions.config().fn_bot.firebase_uri;
  //   // firebase_uri = "https://fourp-bot.firebaseio.com";
  // }

  return {
    verify_token,
    page_access_token,
    studio_token,
    studio_command_uri,
    firebase_uri
  };
}
