const Joi = require('joi');

module.exports = {
  query: {
    language: Joi.valid('eng', 'tgl', 'ceb'),
    zip_code: Joi.string().required(),
  }
};
