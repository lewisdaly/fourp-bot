const functions = require('firebase-functions');
const validate = require('express-validation')
const express = require('express');
const bodyParser = require('body-parser')

const validation = require('./validation');
const isNullOrUndefined = require('../common/utils').isNullOrUndefined;
const {
  getPaymentFactors,
  getPaymentEstimate,
  getConditionsList
} = require('../common/calc');

const app = express();
app.use(bodyParser.json());

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
/**
 * query params:
 * - expecting_baby, string, 'yes' or 'no'
 * - young_children, string, one of '0', '1', '2', '3+'
 * - elementary_school_children, string, one of '0', '1', '2', '3+'
 * - high_school_children, string, one of '0', '1', '2', '3+'
 *
 */
app.get('/', validate(validation), (req, res) => {
  paymentParser(req.query)
  .then(({
    pregnant,
    youngChildren,
    elementarySchoolChildren,
    highSchoolChildren
  }) => {
    if (isNullOrUndefined(pregnant)||
        isNullOrUndefined(youngChildren) ||
        isNullOrUndefined(elementarySchoolChildren) ||
        isNullOrUndefined(highSchoolChildren)
    ) {
      return res.status(400).send('Error. Could not understand query.');
    }

    const { x, y } = getPaymentFactors(elementarySchoolChildren, highSchoolChildren);
    const paymentEstimate = getPaymentEstimate(x, y);
    const conditionsList = getConditionsList(pregnant, youngChildren, elementarySchoolChildren, highSchoolChildren)
      .reduce((acc, curr) => acc + '\n' + curr, '');

    const responseString = `We estimate your payment to be: ${paymentEstimate}p a month, up to ___ a year.${conditionsList}\n`;

    res.status(200).send(responseString);
  });
});

const childrenParser = (childrenText) => {
  if (childrenText.indexOf('+') > -1) {
    return 3; //3 is max for now.
  }

  return parseInt(childrenText);
}

const paymentParser = (query) => {
  return new Promise((resolve, reject) => {
    const {
      elementary_school_children,
      expecting_baby,
      high_school_children,
      young_children,
    } = query;

    if (!expecting_baby) {
      return reject(new Error('param: `expecting_baby` not found'));
    }

    let pregnant = false;
    if (expecting_baby.toLowerCase() === "yes"
        || expecting_baby === '1'
        || expecting_baby.toLowerCase() === 'true'
      ) {
      pregnant = true;
    }

    let youngChildren;
    let elementarySchoolChildren;
    let highSchoolChildren;

    try {
      youngChildren = childrenParser(young_children);
      elementarySchoolChildren = childrenParser(elementary_school_children);
      highSchoolChildren = childrenParser(high_school_children);
    } catch (err) {
      return reject(err);
    }

    return resolve({
      pregnant,
      youngChildren,
      elementarySchoolChildren,
      highSchoolChildren,
    });
  });
}


module.exports = functions.https.onRequest(app);
