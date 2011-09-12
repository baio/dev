(function() {
  var Fs, Http, Path, Url, server;
  Http = require('http');
  Fs = require('fs');
  Url = require('url');
  Path = require('path');
  server = Http.createServer(function(req, res) {
    var contentType, ext, path, url;
    url = Url.parse(req.url);
    path = '.' + req.url;
    console.log(req.url);
    process.on('uncaughtException', function(err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      return res.end(err.toString());
    });
    ext = Path.extname(path);
    contentType = 'text/html';
    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
    }
    return Path.exists(path, function(exists) {
      if (exists) {
        console.log("path : [" + path + "] exists");
        res.writeHead(200, {
          'Content-Type': contentType
        });
        return Fs.createReadStream(path).pipe(res);
      } else {
        console.log("path : [" + path + "] not exists");
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        return res.end("page no found");
      }
    });
  });
  server.listen(8087);
  console.log('http://localhost:8087/');
}).call(this);
