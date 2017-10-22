/**
 * Run inside a google sheet
 * ref: http://www.sohamkamani.com/blog/2017/03/09/sync-data-between-google-sheets-and-firebase/
 */


var secret = 'secret'


function getFirebaseUrl(jsonPath) {
  /*
  We then make a URL builder
  This takes in a path, and
  returns a URL that updates the data in that path
  */
  return 'https://fourp-bot.firebaseio.com/' + jsonPath + '.json?auth=' + secret
}

function syncMasterSheet(excelData) {
  /*
  We make a PUT (update) request,
  and send a JSON payload
  More info on the REST API here : https://firebase.google.com/docs/database/rest/start
  */
  var options = {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(excelData)
  };
  var fireBaseUrl = getFirebaseUrl('zip_codes')

  /*
  We use the UrlFetchApp google scripts module
  More info on this here : https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
  */
  UrlFetchApp.fetch(fireBaseUrl, options);
}

function startSync() {
  //Get the currently active sheet
  var sheet = SpreadsheetApp.getActiveSheet();
  //Get the number of rows and columns which contain some content
  var [rows, columns] = [sheet.getLastRow(), sheet.getLastColumn()];
  //Get the data contained in those rows and columns as a 2 dimensional array
  var data = sheet.getRange(1, 1, rows, columns).getValues();
  var zips = {};
  for(var idx in data) {
    var row = data[idx];
    zips[row[0]] = {municipality: row[1], province_id: row[2]};
  }

  //Use the syncMasterSheet function defined before to push this data to the "masterSheet" key in the firebase database
  syncMasterSheet(zips);
}
