

const getPaymentFactors = (elementarySchoolChildren, highSchoolChildren) => {
  const maxChildren = 3;
  let x = 0;
  let y = 0;

  if (highSchoolChildren >= maxChildren) {
    return {
      x: 0,
      y: maxChildren
    };
  }

  if (elementarySchoolChildren + highSchoolChildren > maxChildren) {
    return {
      x: maxChildren - highSchoolChildren,
      y: highSchoolChildren
    };
  }

  return {
    x: elementarySchoolChildren,
    y: highSchoolChildren
  };
}

const getPaymentEstimate = (x, y) => {

  //ref: http://pantawid.dswd.gov.ph/images/stories/pantawidfaq.pdf
  return 500 + x * 300 + y * 500;

  //TODO: add maximum calculations
  //TODO: what happens if a child misses school? Does this count towards the total?
}

/**
 * Given a current household situation, return an array of strings of the conditions they must meet
 * ref: http://www.officialgazette.gov.ph/programs/conditional-cash-transfer/
 */
const getConditionsList = (pregnant, youngChildren, elementarySchoolChildren, highSchoolChildren) => {
  const conditionsList = [];

  //Conditions for everyone:
  conditionsList.push('You must attend the family development sessions, which include topics on responsible parenting, health, and nutrition.');

  if (pregnant) {
    conditionsList.push('Pregnant women must avail pre- and post-natal care, and be attended during childbirth by a trained professional.');
  }

  if (youngChildren > 0) {
    conditionsList.push('Children aged 0-5 must receive regular preventive health check-ups and vaccines.');
    conditionsList.push('Children aged 6-14 must receive deworming pills twice a year.');
  }

  if (elementarySchoolChildren + highSchoolChildren > 0) {
    //This doesn't line up 100% with the question we are asking, but that's ok.
    conditionsList.push('Children-beneficiaries aged 3-18 must enroll in school, and maintain an attendance of at least 85% of class days every month.');
  }

  return conditionsList;
}

module.exports = {
  getPaymentFactors: getPaymentFactors,
  getPaymentEstimate: getPaymentEstimate,
  getConditionsList: getConditionsList,
};
