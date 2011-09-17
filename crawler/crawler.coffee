http = require 'http'
request = require 'request'
fs = require 'fs'

jsdom = require 'jsdom'
jsdom.defaultDocumentFeatures = {
  FetchExternalResources   : false,
  ProcessExternalResources : false,
  MutationEvents           : '2.0',
  QuerySelector            : false
}
html5 = require 'html5' #https://github.com/aredridel/html5
Iconv = require('iconv').Iconv
Url = require 'url'

window = jsdom.jsdom().createWindow null, null,  parser : html5

lentaHandler = ($) ->

        textElements = (node) -> 
            $(node).contents().filter ->
                $(this).text() && (this.nodeType == 3 || this.nodeName == "A")
        s = $.trim(textElements($(".statya").children(2).children(2).children(1).children(1)).text()) +
            "\n\n" + $.trim($(".statya h2 ~ p:not([class])").text())
        
        s = $.trim s
        s = s.replace /\n+/gm,"\n" 
        
        {date : $("#pacman.statya div.dt").first().text()
        img : $("#pacman.statya .zpic img").first().attr "src"
        header : $("#pacman.statya h2").first().text()
        content : s }
            

srv = http.createServer (req, res) ->        
    
    url = Url.parse(req.url, true).query.url    
    
    if url
    
        request { uri : url, encoding: "binary"},  (error, response, body) ->
                  
            #translate encoding to UTF-8
            regex = new RegExp "charset=([\\w-]+)"
            encoding = regex.exec(response.headers["content-type"])[1].toUpperCase()
            if encoding != 'UTF-8'
                iconv = new Iconv encoding, 'UTF-8'
                body = new Buffer body, 'binary'
                body = iconv.convert(body).toString();
            
            parser = new html5.Parser
                document: window.document
            parser.parse body
              
            jsdom.jQueryify window, 'http://code.jquery.com/jquery-latest.min.js', (window, $) ->
                r = JSON.stringify lentaHandler($)
                console.log r
                res.writeHead 200, 'Content-Type' : 'application/json; charset=UTF-8'
                res.end r

    else
        
        console.log "'url' query parameter not defined"
        res.writeHead 500, 'Content-Type': 'text/plain'
        res.end "'url' query parameter not defined"

               


srv.listen 8088

console.log "listen on http://localhost:8088/"


