const functions = require('firebase-functions');

exports.calculatePay = require('./fn_calculatePay/calculatePay');
exports.getDelay = require('./fn_getDelay');
exports.getMessage = require('./fn_getMessage/getMessage');
exports.getNews = require('./fn_getNews/getNews');
exports.bot = require('./fn_bot/bot');
