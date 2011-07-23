http = require 'http'
request = require 'request'
fs = require 'fs'
jsdom = require 'jsdom'
$ = require 'jquery'

#tribute to megafail

class Grabber
    
    settings =
        
        url : "http://twitter.com/"
        
        fileName : "grabber/grab.html"
        
        delay : 1000
        
        pagesCount : 1
    
    constructor: (options) ->
        console.log  settings
        settings = $.extend settings, options
        console.log settings
        
    @Grab: (options) ->
        g = new Grabber options
        g.grab()
        
    grab: () ->
        
         file = fs.createWriteStream settings.fileName
         
         console.log settings.url
         
         request
         
            url : settings.url 
            
            encoding : "utf-8"
            
            headers : 
                'User-Agent' : "Fiddler"
                'Host' : 'yandex.ru'
            
            method: 'GET'
            
            (error, response, body) ->
                console.log body
                
                file.write body, (error, cnt) ->
                    console.log "written #{cnt}"
                
         

console.log "go"

Grabber.Grab url : "GET http://yandex.ru/yandsearch?p=2&text=poison&lr=213 HTTP/1.1"


        
    
###
var stream = fs.createWriteStream('pushlog.txt');
var written = 0;

var maxPage = 1;
var delay = 100;

function parse(body, callback)
{
    jsdom.env({
      html: body,
      scripts: [
        'http://code.jquery.com/jquery-1.5.min.js'
      ]
    }, function (err, window) {
          var $ = window.jQuery;
           console.log($('#front-signup-inline-overlay').attr("id"));
    });
    
    callback();
}


function handle(page)
{
    console.log("enter : " + page);
    
     var r = request(
        {   url: "http://yandex.ru/yandsearch?text=url%3Awww.sendsms.megafon.ru*+|+url%3Asendsms.megafon.ru*+%D0%B4%D0%BE%D0%BC&lr=213" ,
            headers: {'content-type' :  "text/html; charset=utf-8", 'Set-Cookie' : "yp=1627215614.sp.; path=/; expires=Thu, 31-Dec-2037 20:59:59 GMT; domain=yandex.ru"},
            method: 'GET'},
            function(error, resp, body)
            {
                console.log(error);
                //console.log(body);
                
                
                if (!error)
                {
                    
                    
                    parse(body, function(){
                        
                        console.log("!!!");
                        
                        stream.write(body, written, function(error, bytesRead)
                            {
                                if (!error)
                                {

                                    written += bytesRead;
                                    
                                    console.log("success : " + page + " : " + written );
                                    
                                    page++;
                                    
                                    if (page > maxPage)
                                        console.log("complete");
                                    else
                                        srartHandle(page);
                                }
                                else
                                    console.log(error);
                            });
                            
                        });
                }
                else 
                    console.log("error");
            }
      );
      

      
    
}

function srartHandle(page)
{
    setTimeout(function(){ handle(page) }, delay);
}

srartHandle(1);
###
