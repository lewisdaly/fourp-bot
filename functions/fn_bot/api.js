const request = require('request-promise');
require('request-to-curl');


const FOURP_FEEDBACK_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/2292424/i9l15z/';

const FIREBASE_BASE_URL = 'https://us-central1-fourp-bot.cloudfunctions.net';
const FOURP_GET_NEWS_URL = `${FIREBASE_BASE_URL}/getNews/`;
const FOURP_CALCULATE_PAY_URL = `${FIREBASE_BASE_URL}/calculatePay/`;

module.exports = {

	/**
	 * Unsure what this will look like just yet
	 */
	getPayout: (payload) => {
		return new Promise(function(resolve, reject) {
			resolve({text:'The next scheduled payout for _barangay_ is between _date_1_ and _date_2_. \nHowever, it looks like payments might be delayed by up to _delay_time_'})
		});
	},

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
