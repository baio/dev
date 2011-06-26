(function() {
  var http, s;
  http = require('http');
  s = http.createServer(function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    return res.end('Hello World!!!\n');
  });
  s.listen(8087);
  console.log('Server running at http://maxvm.goip.ru:8087/');
}).call(this);
