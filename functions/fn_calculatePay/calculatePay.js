const functions = require('firebase-functions');

/**
 * query params:
 * - expecting_baby, string,
 * - young_children, string,
 * - elementary_school_children, string,
 * - high_school_children, string,
 *
 */
module.exports = functions.https.onRequest((req, res) => {
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
      res.status(400);
      return res.send('Error. Could not understand query.');
    }

    const { x, y } = getPaymentFactors(elementarySchoolChildren, highSchoolChildren);
    const paymentEstimate = getPaymentEstimate(x, y);
    const conditionsList = getConditionsList(pregnant, youngChildren, elementarySchoolChildren, highSchoolChildren)
      .reduce((acc, curr) => acc + '\n' + curr, '');

    const responseString = `We estimate your payment to be: ${paymentEstimate}p a month, up to ___ a year.${conditionsList}\n`;

    res.send(responseString);
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.send('Error: ', err);
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
