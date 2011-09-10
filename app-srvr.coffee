http = require 'http'
fs = require 'fs'
url = require 'url'

referer = null

http.createServer((req, res) ->
  uri = url.parse req.url
  if uri.pathname == "/img-prr"
      referer = uri
      console.log req.url
      res.writeHead 200, 'Content-Type': 'text/html'
      fs.createReadStream("img-prr/test/img-prr-test.html").pipe res
  else if uri.headers.referer == referer
      res.writeHead 200, 'Content-Type': 'text/plain'
      fs.createReadStream(referer + req.url).pipe res      
  else
      res.writeHead 404, 'Content-Type': 'text/plain'
      res.end "page no found"
).listen 8087

console.log 'http://maxvm2.goip.ru:8087/'