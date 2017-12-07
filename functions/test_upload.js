var request = require("request");

var options = { method: 'POST',
  url: 'https://bcrm.com/register/messenger/bot/4ff75986-8667-4364-8a52-b8fd4d68edb7',
  headers:
   { 'postman-token': 'bb373010-8bac-341b-76a9-e746d268cf44',
     'cache-control': 'no-cache',
     authorization: '9d5493e8-71ea-4726-b171-ed72f0f53c3a',
     accept: 'application/json',
     'content-type': 'application/json' },
  body:
   { id: '1311998552261282',
     token: 'EAAB4jTq3GZBABAM7k6SC0UPfJCPTwY3roWbLVC33UH3JlELNqyR3jLGLr17ChPEtHBasGwAqeJKZCBoEcj6Fd0Fcp4KJ9My5Hx7t6qmMcoOk6r057ZCAt5fRgg5vjDsZAW4JCDlYtrIIlQv0GlwwlZC8jXsQsIMGXOjwmkXDadAZDZD' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
