var http = require('http');
var google = http.createClient(80, 'www.google.ru');
var request = google.request('GET', '/', {'host': 'www.google.ru'});
request.end();
request.on('response', function (response) {
  console.log('STATUS: ' + response.statusCode);
  console.log('HEADERS: ' + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});