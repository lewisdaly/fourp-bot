const request = require('request-promise');
require('request-to-curl');


const FOURP_FEEDBACK_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/2292424/i9l15z/';

const FIREBASE_BASE_URL = 'https://us-central1-fourp-bot.cloudfunctions.net';
const FOURP_GET_NEWS_URL = `${FIREBASE_BASE_URL}/getNews/`;
const FOURP_CALCULATE_PAY_URL = `${FIREBASE_BASE_URL}/calculatePay/`;

module.exports = {

	/**
	 * Payload
	 * - expecting_baby, string, 'yes' or 'no'
	 * - young_children, string, one of '0', '1', '2', '3+'
	 * - elementary_school_children, string, one of '0', '1', '2', '3+'
	 * - high_school_children, string, one of '0', '1', '2', '3+'
	 * - language
	 */
	calculatePay: (payload) => {
		const options = {
			method: 'GET',
			uri: FOURP_CALCULATE_PAY_URL,
			qs: payload,
			json: true
		};

		return request(options)
		.then(response => {
			return response.messages;
		})
		.catch(err => {
			console.log(err);
			return Promise.reject(err);
		});
	},

  getNewsForLanguage: (language) => {
    const options = {
      method: 'GET',
      uri: FOURP_NEWS_URL,
      qs: {
        language,
      },
      json: true
    };

    return request(options)
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
  },

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
    const options = {
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
