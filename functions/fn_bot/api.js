const request = require('request-promise');
require('request-to-curl');


const FOURP_FEEDBACK_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/2292424/i9l15z/';

module.exports = {

  getNewsForLanguage: (language) => {
    //TODO: talk to firebase mate
    
    return {
      story1: 'This is story1.',
      story2: 'This is story2.',
      story3: 'This is story3.'
    };
  };

  /**
   * payload is an object with the following keys:
   * - firstName
   * - lastName
   * - userId
   * - language
   * - score
   * - improved
   * - features
   */
  leaveFeedback: (payload) => {
    var options = {
      method: 'POST',
      uri: FOURP_FEEDBACK_WEBHOOK,
      body: payload,
      json: true
    };

    request(options)
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
  }

}
