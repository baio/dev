    var http, s;
  http = require('http');
  request = require('request');
  
    s = http.createServer(function(req, res) {
      
        request({url:'http://www.google.ru'}, function (error, response, body) {
            
            if (!error && response.statusCode == 200) {

                res.writeHead(200, {
                  'Content-Type': 'text/plain'
                });
                res.end('ok\n');              
            }
            
          });
  });
  
  s.listen(8087);
  console.log('Server running at http://maxvm.goip.ru:8087/');