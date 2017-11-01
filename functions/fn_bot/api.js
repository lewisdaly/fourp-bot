const request = require('request-promise');
require('request-to-curl');
const moment = require('moment');


const ZAPIER_FEEDBACK_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/2292424/i9l15z/';
const ZAPIER_REPORT_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/2292424/i9l7nx/';
const ZAPIER_RECORD_DATE_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/2292424/ix0n6r/';

const FIREBASE_BASE_URL = 'https://us-central1-fourp-bot.cloudfunctions.net';
const FOURP_GET_NEWS_URL = `${FIREBASE_BASE_URL}/getNews/`;
const FOURP_CALCULATE_PAY_URL = `${FIREBASE_BASE_URL}/calculatePay/`;
const FOURP_GET_DELAY_URL = `${FIREBASE_BASE_URL}/getDelay/`;

module.exports = {

	/**
	 * Submit a date recording. This is raw, and will need further processing
	 * Payload:
	 * location,
	 * date,
	 * isDelayed
	 */

	recordDate: (payload) => {
		const options = {
      method: 'POST',
      uri: ZAPIER_RECORD_DATE_WEBHOOK,
      body: payload,
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
	 * payload:
	 * language
	 * phone_number
	 * lat
	 * lng
	 */
	saveUserProperties: (controller, payload) => {
		return new Promise(function(resolve, reject) {

			controller.storage.users.save(payload, (err) => {
				if (err) {
					reject(err);
				}

				resolve(true);
			});
		});
	},

	/**
	 * Payload:
	 * user_id: String
	 * first_name: String
	 * last_name: String
	 * phone_number: String
	 * language: String
	 * report_type: String
	 * description: String
	 * lat: Float
	 * lng: Float
	 * address: String
	 * country: String
	 * zip: Int
	 */
	report: (payload) => {
		const options = {
      method: 'POST',
      uri: ZAPIER_REPORT_WEBHOOK,
      body: payload,
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
	 * payload:
	 * language: String
	 * zip_code: Filipino zip code
	 */
	getPayout: (payload) => {
		const options = {
			method: 'GET',
			uri: FOURP_GET_DELAY_URL,
			qs: payload,
			json: true
		};

		return request(options)
			.then(response => {
				const municipality = response.municipality;
				const lastDateString = moment(response.last_date).format('LL');
				const nextDateString = moment(response.next_date).format('LL');

				const script = {
					eng: `On average, the last payout for ${municipality} was ${lastDateString}. We estimate the next payout to be around: ${nextDateString}.`,
					tgl: `Kadalasan, ang huling payout sa ${municipality} ay noong ${lastDateString}. Tinatantya naming ang susunod na payout ay: ${nextDateString}.`,
					ceb: `Kasagaran, ang miaging payout sa ${municipality} kay niadtong ${lastDateString}. Gibanabana namong ang sunod payout sa: ${nextDateString}.`,
				};

				return {
					text: script[payload.language]
				};
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
      uri: FOURP_GET_NEWS_URL,
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
      uri: ZAPIER_FEEDBACK_WEBHOOK,
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
