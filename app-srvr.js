(function() {
  var fs, http, referer, url;
  http = require('http');
  fs = require('fs');
  url = require('url');
  referer = null;
  http.createServer(function(req, res) {
    var uri;
    uri = url.parse(req.url);
    if (uri.pathname === "/img-prr") {
      referer = uri;
      console.log(req.url);
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      return fs.createReadStream("img-prr/test/img-prr-test.html").pipe(res);
    } else if (req.url.headers.referer === referer) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      console.log(referer + req.url);
      return "test";//fs.createReadStream(referer + req.url).pipe(res);
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      return res.end("page no found");
    }
  }).listen(8087);
  console.log('http://maxvm2.goip.ru:8087/');
}).call(this);
