//http://intertwingly.net/blog/2011/01/07/First-Impressions-node-js
var     http  = require('http'),
        html5 = require('html5'),
        sys = require('sys'),
        jsdom = require('jsdom'),
        window = jsdom.jsdom().createWindow(null, null, {parser: html5}),
        request = require('request');

/*
jsdom.env({
  html: 'http://lenta.ru/news/2011/08/21/mishap/',
  scripts:  ['http://code.jquery.com/jquery-latest.min.js'],
  done: function(errors, window) {
    var $ = window.$;
    console.log($('html').text());
    //console.log($('html').text());
  }
});
*/



request({
        uri: "http://www.lenta.ru/news/2011/08/21/surging/",
        encoding: "utf-8",
        method: 'GET',
        host : "lenta.ru",
        headers: {
          'content-type': "text/html; charset=utf-8"
        }
      },
      function(error, response, body){
          console.log(response);
           //var doc = jsdom.jsdom(body, null, {features : {FetchExternalResources : ['script', 'img', 'css', 'frame', 'link']  } });
           //var win   = doc.createWindow();
           //console.log(window.document.innerHTML);
        }
      );


/*
request({
        uri: "http://www.lenta.ru/news/2011/08/21/surging/",
        encoding: "utf-8",
        method: 'GET',
        headers: {
          'content-type': "text/html; charset=utf-8"
        }
      },
      function(error, response, body){
          //console.log(body.toString());
          var parser = new html5.Parser({document: window.document});
          console.log("start parse");
          parser.parse(response);
          console.log("end parse");
          jsdom.jQueryify(window, 'http://code.jquery.com/jquery-latest.min.js', function(window, $) {
            console.log(window.$(document).text());
            $('h3').each(function() {
              console.log($(this).text());
            });
          });
        }
      );
*/


/*
var host = 'lenta.ru';
var add = '/news/2011/08/21/mishap/';
//var host = "youtube.com";
//var add = "/user/baio1980/";
var rubix = http.createClient(80, host);
var request = rubix.request('GET', add, {'host': host});
request.end();
request.on('response', function (response) {
  console.log(response);
  var parser = new html5.Parser({document: window.document});
  //parser.parse("<html><div class=test>test</div><div></html>");
  parser.parse(response);
  jsdom.jQueryify(window, 'http://code.jquery.com/jquery-latest.min.js', function(window, $) {
    console.log($('html').text());
    $('h3').each(function() {
      console.log($(this).text());
    });
  });
});
*/




