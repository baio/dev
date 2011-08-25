http = require 'http'
request = require 'request'
fs = require 'fs'
jsdom = require 'jsdom'
html5 = require 'html5' #https://github.com/aredridel/html5
window = jsdom.jsdom().createWindow null, null,  parser : html5

class crawler
    
    response = null
    
    settings = 
        
        url : null    
        
        type : "details" # details, text
        
        onSuccess : null
        
        onError : null
                
    constructor: (@response, @settings)->
        
    crawl: ->
 
        request
         
            uri : @settings.url 
            
            encoding : "utf-8"
                        
            method: 'GET'
            
            headers: {'content-type' :  "text/html; charset=utf8"}
            
            (error, response, body) =>
                
                try
                    
                    console.log body
                    
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
         
        #inputfile = fs.readFileSync('tests\lj.html');
        
        #parser.parse(inputfile);
        
        ###
        parser = new html5.Parser document: window.document

        parser.parse body
        
        jsdom.jQueryify window, 'http://code.jquery.com/jquery-latest.min.js', (window, $)->
                console.log "!!!"
                console.log window.document.innerHTML
        
        clt = http.createClient 80, "blogspot.com"
        req = clt.request 'GET', '/2011/08/une.html', 'host': 'ru-vs-br.blogspot.com'
        ###
        clt = http.createClient 80, "gazeta.ru"
        req = clt.request 'GET', '/news/lenta/2011/08/20/n_1975317.shtml', 'host': 'gazeta.ru'
        
        req.end()
        req.on 'response',  (response, body) ->
            
            #console.log response.data
            
            parser = new html5.Parser document: window.document
    
            parser.parse response
            
            jsdom.jQueryify window, 'http://code.jquery.com/jquery-latest.min.js', (window, $)->
                    console.log $('body').text()

    getDetails: ($)->
        
        console.log "start getDetails : #{$("body").text()}"
        
            
    getContent: ($)->
        
        #console.log "start getContent : #{$("body").text()}"
        
    onSuccess: (data)->
        console.log "Success : " + data
        
    onError: (error)->
        console.log "Error : " + error
        
cr = new crawler null
            url : "http://www.lenta.ru/news/2011/08/21/final/"
            type : "details"
            
cr.crawl()