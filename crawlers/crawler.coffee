http = require 'http'
request = require 'request'
fs = require 'fs'
jsdom = require 'jsdom'
html5 = require 'html5' #https://github.com/aredridel/html5
window = jsdom.jsdom().createWindow null, null,  parser : html5
Iconv = require('iconv').Iconv
Url = require 'url'

class crawler
    
    TMP_FILE_NAME = null
    
    response = null
    
    settings = 
        
        url : null    
        
        type : "details" # details, text
        
        handlers : []
        
        onError : null
                
    constructor: (@response, @settings)->
        
    crawl: ->
                    
        TMP_FILE_NAME = "crawler_#{Date.now()}_temp.html"
 
        request
         
            uri : @settings.url 
            
            encoding : "binary"
                        
            method: 'GET'
                        
            (error, response, body) =>
                
                try
                    
                    regex = new RegExp "charset=([\\w-]+)"
                    
                    encoding = regex.exec(response.headers["content-type"])[1].toUpperCase()
                                             
                    iconv = new Iconv encoding, 'UTF-8'
                                        
                    body = new Buffer body, 'binary'
                    
                    body = iconv.convert(body).toString()
                    
                                    
                    if !error
                        
                        @getJQuery response, body, ($)=>             
                                
                                switch @settings.type 
                                        when "details" then res = @getDetails $
                                        when "details" then res = @getContent $
                                        else throw "settings.type contains unrecognized type"
                                
                                @onSuccess res
                catch err
                    @onError err
                            
    
    getJQuery: (response, body, callback) ->
        
        @getJQuerySimple response, body, callback,  @getJQueryHtml5
            
            
    getJQuerySimple: (response, body, callback, fallback) ->
                
        console.log "getJQuerySimple"
                        
        try
            
            jsdom.env body, 
                    
                    ['http://code.jquery.com/jquery-latest.min.js'],
                             
                    (err, window) =>
                      
                          if !err
                            callback window.jQuery
                          else 
                              throw err
        catch err
            @onError err
            fallback response, body, callback
            
            
    getJQueryHtml5: (response, body, callback) ->
        
        console.log "getJQueryHtml5" 
        #console.log body        

        fs.writeFile "/home/bitnami/dev/crawlers/" + TMP_FILE_NAME, body, ->
            console.log "written"            
            
            clt = http.createClient 8085, "91.205.189.32"
            req = clt.request 'GET', "/workspace/crawlers/" + TMP_FILE_NAME, 'host': '91.205.189.32'
            
            req.end()
            req.on 'response',  (response) ->
                            
                console.log "response"
                
                fs.unlink "/home/bitnami/dev/crawlers/" + TMP_FILE_NAME
                                    
                parser = new html5.Parser document : window.document
        
                parser.parse response
                
                jsdom.jQueryify window, 'http://code.jquery.com/jquery-latest.min.js', (window, $)=>
                        callback $

    getDetails: ($)->
        
        for h in @settings.handlers
            r = h $
            if r then return r
      
    getContent: ($)->
        
        #console.log "start getContent : #{$("body").text()}"
        
    onSuccess: (data)->
        console.log "Success : " + data
        
    onError: (error)->
        console.log "Error : " + error
                
console.log("start")

#handlers

lentaHandler = ($) ->
    console.log $($("#pacman.statya div.dt")[0]).text()
    console.log $($("#pacman.statya .zpic img")[0]).attr "src"
    console.log $($("#pacman.statya h2")[0]).text()
    #console.log $(".zpic :first").html()
    #console.log $("#pacman.statya").html()


cr = new crawler null
            url : "http://www.lenta.ru/news/2011/08/26/mvf/"
            type : "details"
            handlers : [lentaHandler]
            
cr.crawl()




