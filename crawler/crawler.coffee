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

String::rn = () ->
    @replace /\n+/gm,"\n"

lenta = ($) ->

        lentaContent = ($) ->
                textElements = (node) -> 
                    $(node).contents().filter ->
                        $(this).text() && (this.nodeType == 3 || this.nodeName == "A")
                s = $.trim(textElements($(".statya").children(2).children(2).children(1).children(1)).text()) +
                    "\n\n" + $.trim($(".statya h2 ~ p:not([class])").text())        
                s.rn()
        source : "lenta"
        date : $("#pacman.statya div.dt:first").text()
        img : $("#pacman.statya .zpic img:first").attr "src"
        header : $("#pacman.statya h2:first").text()
        content : lentaContent $ 
        
lenta2 = ($) ->
    source : "lenta"
    date : $("#article td:first").text()
    img : $("#article div.photo img").attr "src"
    header : $("#article h1").text()
    content : $("#article h1 ~ p").text().rn()
    
lj = ($) ->
    source : "lj"
    date : $(".entry-date:first").text()
    img : $(".entry-content img").attr "src"
    header : $("div.entry-wrap [class=entry-title]").text()
    content : $(".entry-content").text().rn()    
    
handlers = [
        {d : "lenta.ru", h : lenta }
        {d : "lenta.ru", h : lenta2 }
        {d : "navalny.livejournal.com", h : lj }
    ]
    
getHandlers = ($, domain) ->
    r =  $.grep handlers, (e) -> e.d == domain
    $.map r, (e) -> e.h
    
srv = http.createServer (req, res) ->        
    
    handleError = (error) ->
        error = "Error : " + error
        console.log error
        res.writeHead 500, 'Content-Type': 'text/plain'
        res.end error
    
      
    process.on 'uncaughtException',  (error) ->
        handleError error
    
    u = Url.parse req.url, true
    url = u.query.url    
    
    if url
    
        u = Url.parse url
        
        if !u.hostname then throw "'Url' query parameter invalid format"
        
        domain = u.hostname.replace new RegExp('^www\.'), ''
    
        request { uri : url, encoding: "binary"},  (error, response, body) ->
            
            if !error
                #translate encoding to UTF-8
                regex = new RegExp "charset=([\\w-]+)"
                encoding = regex.exec(response.headers["content-type"])[1].toUpperCase()
                iconv = new Iconv encoding, 'UTF-8'
                body = new Buffer body, 'binary'
                body = iconv.convert(body).toString();
                
                parser = new html5.Parser
                    document: window.document
                parser.parse body
                  
                jsdom.jQueryify window, 'http://code.jquery.com/jquery-latest.min.js', (window, $) ->

                    for h in getHandlers $, domain

                        r = h($)
                        if r.date
                            break
                        else r = null
                        
                    if r
                        r = JSON.stringify r
                        console.log r
                        res.writeHead 200, 'Content-Type' : 'application/json; charset=UTF-8'
                        res.end r
                    else handleError "Handler not found"
                        
            else
                handleError error

    else
        handleError "'url' query parameter not defined"
                       

srv.listen 8088

console.log "listen on http://localhost:8088/"


