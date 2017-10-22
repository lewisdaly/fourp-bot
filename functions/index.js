const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.calculatePay = require('./fn_calculatePay/calculatePay');
exports.getDelay = require('./fn_getDelay/getDelay')(functions, admin);
exports.getMessage = require('./fn_getMessage/getMessage');
exports.getNews = require('./fn_getNews/getNews')(functions, admin);
exports.bot = require('./fn_bot/bot');
