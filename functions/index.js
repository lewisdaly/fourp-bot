const functions = require('firebase-functions');
const getNews = require('./getNews/getNews');

exports.getNews = getNews;

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })
