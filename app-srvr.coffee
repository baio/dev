Http = require 'http'
Fs = require 'fs'
Url = require 'url'
Path = require 'path'



server = Http.createServer (req, res) ->
  
    url = Url.parse req.url
    path = '.' + req.url
  
    console.log req.url
  
    process.on 'uncaughtException',  (err) ->
        res.writeHead 500, 'Content-Type': 'text/plain'
        res.end err.toString()
    
    ext = Path.extname path
    contentType = 'text/html'
    switch ext
        when '.js' then contentType = 'text/javascript'    
        when '.css' then contentType = 'text/css'
    

    Path.exists path, (exists) ->
        if exists
              console.log "path : [#{path}] exists"
              res.writeHead 200, 'Content-Type': contentType
              Fs.createReadStream(path).pipe res
        else
              console.log "path : [#{path}] not exists"
              res.writeHead 404, 'Content-Type': 'text/plain'
              res.end "page no found"
      
server.listen 8087


console.log 'http://localhost:8087/'