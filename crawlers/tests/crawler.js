(function() {
  var cr, crawler, fs, html5, http, jsdom, request, window;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  http = require('http');
  request = require('request');
  fs = require('fs');
  jsdom = require('jsdom');
  html5 = require('html5');
  window = jsdom.jsdom().createWindow(null, null, {
    parser: html5
  });
  crawler = (function() {
    var response, settings;
    response = null;
    settings = {
      url: null,
      type: "details",
      onSuccess: null,
      onError: null
    };
    function crawler(response, settings) {
      this.response = response;
      this.settings = settings;
    }
    crawler.prototype.crawl = function() {
      return request({
        uri: this.settings.url,
        encoding: "utf-8",
        method: 'GET',
        headers: {
          'content-type': "text/html; charset=utf8"
        }
      }, __bind(function(error, response, body) {
        try {
          console.log(body);
          if (!error) {
            return this.getJQuery(response, body, __bind(function($) {
              var res;
              switch (this.settings.type) {
                case "details":
                  res = this.getDetails($);
                  break;
                case "details":
                  res = this.getContent($);
                  break;
                default:
                  throw "settings.type contains unrecognized type";
              }
              return this.onSuccess(res);
            }, this));
          }
        } catch (err) {
          return this.onError(err);
        }
      }, this));
    };
    crawler.prototype.getJQuery = function(response, body, callback) {
      return this.getJQuerySimple(response, body, callback, this.getJQueryHtml5);
    };
    crawler.prototype.getJQuerySimple = function(response, body, callback, fallback) {
      console.log("getJQuerySimple");
      try {
        return jsdom.env(body, ['http://code.jquery.com/jquery-latest.min.js'], __bind(function(err, window) {
          if (!err) {
            return callback(window.jQuery);
          } else {
            throw err;
          }
        }, this));
      } catch (err) {
        this.onError(err);
        return fallback(response, body, callback);
      }
    };
    crawler.prototype.getJQueryHtml5 = function(response, body, callback) {
      var clt, req;
      console.log("getJQueryHtml5");
      /*
              parser = new html5.Parser document: window.document
      
              parser.parse body
              
              jsdom.jQueryify window, 'http://code.jquery.com/jquery-latest.min.js', (window, $)->
                      console.log "!!!"
                      console.log window.document.innerHTML
              
              clt = http.createClient 80, "blogspot.com"
              req = clt.request 'GET', '/2011/08/une.html', 'host': 'ru-vs-br.blogspot.com'
              */
      clt = http.createClient(80, "gazeta.ru");
      req = clt.request('GET', '/news/lenta/2011/08/20/n_1975317.shtml', {
        'host': 'gazeta.ru'
      });
      req.end();
      return req.on('response', function(response, body) {
        var parser;
        parser = new html5.Parser({
          document: window.document
        });
        parser.parse(response);
        return jsdom.jQueryify(window, 'http://code.jquery.com/jquery-latest.min.js', function(window, $) {
          return console.log($('body').text());
        });
      });
    };
    crawler.prototype.getDetails = function($) {
      return console.log("start getDetails : " + ($("body").text()));
    };
    crawler.prototype.getContent = function($) {};
    crawler.prototype.onSuccess = function(data) {
      return console.log("Success : " + data);
    };
    crawler.prototype.onError = function(error) {
      return console.log("Error : " + error);
    };
    return crawler;
  })();
  cr = new crawler(null, {
    url: "http://www.lenta.ru/news/2011/08/21/final/",
    type: "details"
  });
  cr.crawl();
}).call(this);
