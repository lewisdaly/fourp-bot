var request = require('request');

module.exports = function(controller) {

    console.log('Subscribing to Facebook events...');
    request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + controller.config.access_token,
        function(err, res, body) {
            if (err) {
                console.log('Could not subscribe to page messages!');
                throw new Error(err);
            } else {
                console.log('Successfully subscribed to Facebook events:', body);
                controller.startTicking();
            }
        });

};
