const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.bot = require('./fn_bot/bot');
exports.calculatePay = require('./fn_calculatePay/calculatePay');
exports.getDelay = require('./fn_getDelay/getDelay')(functions, admin);
exports.getNews = require('./fn_getNews/getNews')(functions, admin);
