http = require 'http'
s = http.createServer (req, res) ->
  res.writeHead 200, 'Content-Type': 'text/plain'
  res.end 'Hello World!\n'

s.listen 8087
console.log('Server running at http://maxvm.goip.ru:8087/');