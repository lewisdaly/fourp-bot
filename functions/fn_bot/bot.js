const env = require('node-env-file');
env(__dirname + '/.env');

const Botkit = require('botkit');


const controller = Botkit.facebookbot({
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
});


const app = require(__dirname + '/express_webserver.js')(controller);


module.exports = functions.https.onRequest(app);
