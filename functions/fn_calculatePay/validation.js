const Joi = require('joi');

module.exports = {
  query: {
    expecting_baby: Joi.string().required(),
    young_children: Joi.string().required(),
    elementary_school_children: Joi.string().required(),
    high_school_children: Joi.string().required(),
    language: Joi.valid('eng', 'tgl', 'ceb').required(),
  }
};
