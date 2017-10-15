const Joi = require('joi');

module.exports = {
  params: {
    messageId: Joi.string().required(),
  },
  query: {
    language: Joi.valid('eng', 'tgl', 'ceb'),
  }
};
