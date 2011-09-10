(function() {
  var Iconv, Url, cr, crawler, fs, html5, http, jsdom, lentaHandler, request, window;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  http = require('http');
  request = require('request');
  fs = require('fs');
  jsdom = require('jsdom');
  html5 = require('html5');
  window = jsdom.jsdom().createWindow(null, null, {
    parser: html5
  });
  Iconv = require('iconv').Iconv;
  Url = require('url');
  crawler = (function() {
    var TMP_FILE_NAME, response, settings;
    TMP_FILE_NAME = null;
    response = null;
    settings = {
      url: null,
      type: "details",
      handlers: [],
      onError: null
    };
    function crawler(response, settings) {
      this.response = response;
      this.settings = settings;
    }
    crawler.prototype.crawl = function() {
      TMP_FILE_NAME = "crawler_" + (Date.now()) + "_temp.html";
      return request({
        uri: this.settings.url,
        encoding: "binary",
        method: 'GET'
      }, __bind(function(error, response, body) {
        var encoding, iconv, regex;
        try {
          regex = new RegExp("charset=([\\w-]+)");
          encoding = regex.exec(response.headers["content-type"])[1].toUpperCase();
          iconv = new Iconv(encoding, 'UTF-8');
          body = new Buffer(body, 'binary');
          body = iconv.convert(body).toString();
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
      console.log("getJQueryHtml5");
      return fs.writeFile("/home/bitnami/dev/crawlers/" + TMP_FILE_NAME, body, function() {
        var clt, req;
        console.log("written");
        clt = http.createClient(8085, "91.205.189.32");
        req = clt.request('GET', "/workspace/crawlers/" + TMP_FILE_NAME, {
          'host': '91.205.189.32'
        });
        req.end();
        return req.on('response', function(response) {
          var parser;
          console.log("response");
          fs.unlink("/home/bitnami/dev/crawlers/" + TMP_FILE_NAME);
          parser = new html5.Parser({
            document: window.document
          });
          parser.parse(response);
          return jsdom.jQueryify(window, 'http://code.jquery.com/jquery-latest.min.js', __bind(function(window, $) {
            return callback($);
          }, this));
        });
      });
    };
    crawler.prototype.getDetails = function($) {
      var h, r, _i, _len, _ref;
      _ref = this.settings.handlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        r = h($);
        if (r) {
          return r;
        }
      }
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
  console.log("start");
  lentaHandler = function($) {
    console.log($($("#pacman.statya div.dt")[0]).text());
    console.log($($("#pacman.statya .zpic img")[0]).attr("src"));
    return console.log($($("#pacman.statya h2")[0]).text());
  };
  cr = new crawler(null, {
    url: "http://www.lenta.ru/news/2011/08/26/mvf/",
    type: "details",
    handlers: [lentaHandler]
  });
  cr.crawl();
}).call(this);