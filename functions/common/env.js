const env = require('node-env-file');

module.exports = (functions) => {

	let envFilename = null;
	switch (process.env.NODE_ENV) {
		case 'local':
		case 'production':
			envFilename = `.env_${process.env.NODE_ENV}`;
			console.warn(`loading environment from: ${envFilename}`);
			break;
		default:
			console.warn('WARNING: NODE_ENV not set. defaulting to production');
			envFilename = '.env_production';
	}

  let verify_token = null;
  let page_access_token = null;
  let studio_token = null;
  let studio_command_uri = null;
  let firebase_uri = null;

  env(__dirname + '/.env_common');
	env(__dirname + '/' + envFilename);

  verify_token = process.env.verify_token;
  page_access_token = process.env.page_access_token;
  studio_token = process.env.studio_token;
  studio_command_uri = process.env.studio_command_uri;
  firebase_uri = process.env.firebase_uri;

  return {
    verify_token,
    page_access_token,
    studio_token,
    studio_command_uri,
    firebase_uri
  };
}
