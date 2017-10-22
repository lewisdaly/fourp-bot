const env = require('node-env-file');

module.exports = (functions) => {
  let verify_token = null;
  let access_token = null;
  let studio_token = null;
  let studio_command_uri = null;
  let firebase_uri = null;

  //TODO: not ideal. Don't infer, Lewis.
  // if (!functions.config().verify_token) {
  //   console.log("not running in firebase");
    env(__dirname + '/.env_fn_bot');

    verify_token = process.env.verify_token;
    access_token = process.env.access_token;
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
    access_token,
    studio_token,
    studio_command_uri,
    firebase_uri
  };
}
