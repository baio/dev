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
        
        onSuccess : null
        
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
                                             
                    iconv = new Iconv 'windows-1251', 'UTF-8'
                                        
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
        
        $("a").each ->
            console.log $(@).html()
        
        
            
    getContent: ($)->
        
        #console.log "start getContent : #{$("body").text()}"
        
    onSuccess: (data)->
        console.log "Success : " + data
        
    onError: (error)->
        console.log "Error : " + error
                
console.log "start"

cr = new crawler null
            url : "http://www.lenta.ru/articles/2011/08/25/mirzaev/"
            type : "details"
            
cr.crawl()