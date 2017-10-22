// const functions = require('firebase-functions');
const validate = require('express-validation')
const express = require('express');
const moment = require('moment');

const validation = require('./validation');
const isNullOrUndefined = require('../common/utils').isNullOrUndefined;
const paths = require('../common/definitions').paths;


module.exports = (functions, admin) => {
  const app = express();


  app.use(function (err, req, res, next) {
    // specific for validation errors
    if (err instanceof ev.ValidationError) {
      console.log("isValidationError");
      return res.status(err.status).json(err);
    }

    // other type of errors, it *might* also be a Runtime Error
    // example handling
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).send(err.stack);
    } else {
      return res.status(500);
    }
  });

  const averageMoments = (moments) => {
    if (moments.length === 0) {
      return moment(0);
    }

    const totalEpoch = moments.reduce((acc, curr) => {
      return acc + curr.valueOf();
    }, 0);

    return moment(totalEpoch/moments.length);
  }


  /**
   * Get all of the reports for a given provinceId
   * @returns [<Moment>]
   */
  const getReportsForProvinceId = (provinceId) => {
    const ref = admin.database().ref(paths.delay_report);

    //id must be a string
    return ref.orderByChild("province_id").equalTo(`${provinceId}`).once('value')
    .then(snapshot => {
      const values = snapshot.val();
      const dates = Object.keys(values).map(key => {
        const date = values[key].date;
        if (!date) {
          return null;
        }

        return moment(date);
      });

      return dates.filter(date => date !== null);
    });
  };

  /**
   * query params:
   * - zip_code
   * - language
   *
   */
  app.get('*', validate(validation), (req, res) => {
    const { zip_code } = req.query;

    //TODO: lookup zip code in firebase & get province Id
    return admin.database().ref(`${paths.zip_code}/${zip_code}`).once('value')
    .then(snapshot => snapshot.val())
    .then(value => {
      if (!value) {
        return Promise.reject(new Error(`Could not find location with zip code: ${zip_code}`));
      }

      return getReportsForProvinceId(value.province_id);
    })
    .then(reports => {
      console.log(reports);
      //TODO: we need to figure out how to group general dates together, for now this works
      const averageLastReportMoment = averageMoments(reports);
      const estimatedNextDate = averageLastReportMoment.add('2', months);

      return res.status(200).send({last_date: averageLastReportMoment, next_date:estimatedNextDate});
    })
    .catch(err => {
      //TODO: better error handling
      console.log('err', err);
      return res.status(500).send({'error':err.message});
    })

  });



  return functions.https.onRequest(app);
};
