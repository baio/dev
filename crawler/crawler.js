(function() {
  var Iconv, Url, fs, getHandlers, handlers, html5, http, jsdom, lenta, lenta2, lj, request, srv, window;
  http = require('http');
  request = require('request');
  fs = require('fs');
  jsdom = require('jsdom');
  jsdom.defaultDocumentFeatures = {
    FetchExternalResources: false,
    ProcessExternalResources: false,
    MutationEvents: '2.0',
    QuerySelector: false
  };
  html5 = require('html5');
  Iconv = require('iconv').Iconv;
  Url = require('url');
  window = jsdom.jsdom().createWindow(null, null, {
    parser: html5
  });
  String.prototype.rn = function() {
    return this.replace(/\n+/gm, "\n");
  };
  lenta = function($) {
    var lentaContent;
    lentaContent = function($) {
      var s, textElements;
      textElements = function(node) {
        return $(node).contents().filter(function() {
          return $(this).text() && (this.nodeType === 3 || this.nodeName === "A");
        });
      };
      s = $.trim(textElements($(".statya").children(2).children(2).children(1).children(1)).text()) + "\n\n" + $.trim($(".statya h2 ~ p:not([class])").text());
      return s.rn();
    };
    return {
      source: "lenta",
      date: $("#pacman.statya div.dt:first").text(),
      img: $("#pacman.statya .zpic img:first").attr("src"),
      header: $("#pacman.statya h2:first").text(),
      content: lentaContent($)
    };
  };
  lenta2 = function($) {
    return {
      source: "lenta",
      date: $("#article td:first").text(),
      img: $("#article div.photo img").attr("src"),
      header: $("#article h1").text(),
      content: $("#article h1 ~ p").text().rn()
    };
  };
  lj = function($) {
    return {
      source: "lj",
      date: $(".entry-date:first").text(),
      img: $(".entry-content img").attr("src"),
      header: $("div.entry-wrap [class=entry-title]").text(),
      content: $(".entry-content").text().rn()
    };
  };
  handlers = [
    {
      d: "lenta.ru",
      h: lenta
    }, {
      d: "lenta.ru",
      h: lenta2
    }, {
      d: "navalny.livejournal.com",
      h: lj
    }
  ];
  getHandlers = function($, domain) {
    var r;
    r = $.grep(handlers, function(e) {
      return e.d === domain;
    });
    return $.map(r, function(e) {
      return e.h;
    });
  };
  srv = http.createServer(function(req, res) {
    var domain, handleError, u, url;
    handleError = function(error) {
      error = "Error : " + error;
      console.log(error);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      return res.end(error);
    };
    process.on('uncaughtException', function(error) {
      return handleError(error);
    });
    u = Url.parse(req.url, true);
    url = u.query.url;
    if (url) {
      u = Url.parse(url);
      if (!u.hostname) {
        throw "'Url' query parameter invalid format";
      }
      domain = u.hostname.replace(new RegExp('^www\.'), '');
      return request({
        uri: url,
        encoding: "binary"
      }, function(error, response, body) {
        var encoding, iconv, parser, regex;
        if (!error) {
          regex = new RegExp("charset=([\\w-]+)");
          encoding = regex.exec(response.headers["content-type"])[1].toUpperCase();
          iconv = new Iconv(encoding, 'UTF-8');
          body = new Buffer(body, 'binary');
          body = iconv.convert(body).toString();
          parser = new html5.Parser({
            document: window.document
          });
          parser.parse(body);
          return jsdom.jQueryify(window, 'http://code.jquery.com/jquery-latest.min.js', function(window, $) {
            var h, r, _i, _len, _ref;
            _ref = getHandlers($, domain);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              h = _ref[_i];
              r = h($);
              if (r.date) {
                break;
              } else {
                r = null;
              }
            }
            if (r) {
              r = JSON.stringify(r);
              console.log(r);
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=UTF-8'
              });
              return res.end(r);
            } else {
              return handleError("Handler not found");
            }
          });
        } else {
          return handleError(error);
        }
      });
    } else {
      return handleError("'url' query parameter not defined");
    }
  });
  srv.listen(8088);
  console.log("listen on http://localhost:8088/");
}).call(this);
