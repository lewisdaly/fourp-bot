

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
  conditionsList.push({
		eng: 'You must attend the family development sessions, which include topics on responsible parenting, health, and nutrition.',
		tgl: 'Kailangan dumalo sa family development session, kung saan tutulong kung paano maging responsableng magulang, alagaan ang kalusugan at nutrisyon.',
		ceb: 'Kinahanglan muapil sa family development session, diin mutabang sa pagkaresponsableng ginikanan, atimanon ang lawas ug nutrisyon.'
	});

  if (pregnant) {
    conditionsList.push({
			eng: 'Pregnant women must avail pre- and post-natal care, and be attended during childbirth by a trained professional.',
			tgl: 'Kailangang sumailalim ang mga buntis sa pangangalagang medikal bago at matapos sila manganak. Kinakailangan ding isang propesyonal na kumadrona o doktor ang magpaanak sa kanila',
			ceb: 'Kinahanglan magpa-check up gayud ang mga magbos sa wala pa manganak ug pagkahuman manganak. Kinahanglan nga usa ka propesyonal nga mananabang o doktor ang magpaanak nila.'
		});
  }

  if (youngChildren > 0) {
    conditionsList.push({
			eng: 'Children aged 0-5 must receive regular preventive health check-ups and vaccines.',
			tgl: 'Kailangang regular na magpa-check up at magpabakuna ang mga batang may edad 0 hanggang 5.',
			ceb: 'Kinahanglan nga regular magpa-check up ug magpabakuna ang mga batang edad 0 hangtud 5.'
		});
    conditionsList.push({
			eng: 'Children aged 6-14 must receive deworming pills twice a year.',
			tgl: 'Kailangang uminom ng pampurga ng bulate sa tiyan ang kabataang may edad 6 hanggang 14 dalawang beses sa isang taon.',
			ceb: 'Kinahanglan muinom ug pampurga sa bitok sa tiyan ang bata nga nag edad ug 6 hangtud 14 kaduha sa usa ka tuig.'
		});
  }

  if (elementarySchoolChildren + highSchoolChildren > 0) {
    //This doesn't line up 100% with the question we are asking, but that's ok.
    conditionsList.push({
			eng: 'Children-beneficiaries aged 3-18 must enroll in school, and maintain an attendance of at least 85% of class days every month.',
			tgl: 'Kailangang mag-enrol sa eskuwelahan ang mga benepisyaryong kabataan na may edad 3 hanggang 18, at pumasok sa klase nang di-bababa sa 85% ng kabuuang bilang ng klase kada buwan.',
			ceb: 'Kinahanglan mag-enrol sa eskwelahan ang mga benepisyaryong mga bata nga may edad 3 hangtud 18, ug musulod sa klase nga di moubos sa 85% ng kinatibuk-ang ihap sa klase sa kada bulan.'
		});
  }

  return conditionsList;
}

module.exports = {
  getPaymentFactors: getPaymentFactors,
  getPaymentEstimate: getPaymentEstimate,
  getConditionsList: getConditionsList,
};
