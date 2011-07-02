(function() {
  var BufferList, fs, gm, hResp, http, request, s, sys, url;
  require.paths.unshift(__dirname + '/lib/');
  http = require('http');
  request = require('request');
  fs = require('fs');
  BufferList = require('bufferlist').BufferList;
  gm = require('gm');
  http = require('http');
  fs = require('fs');
  sys = require('sys');
  url = require('url');
  hResp = function(buf, filename, callback, res, error, response, body) {
    var height, image_64, mimetype, type_prefix, width;
    if (!error && response.statusCode === 200) {
      mimetype = response.headers["content-type"];
      if (mimetype === "image/gif" || mimetype === "image/jpeg" || mimetype === "image/jpg" || mimetype === "image/png" || mimetype === "image/tiff") {
        type_prefix = "data:" + mimetype + ";base64,";
        image_64 = body.toString('base64');
        image_64 = type_prefix + image_64;
        width = 0;
        height = 0;
        fs.write(filename, body);
        return gm(filename).size(function(err, size) {
          var return_variable;
          if (err) {
            return res.end(err.message, 400);
          } else {
            width = size.width;
            height = size.height;
            return_variable = {
              "width": width,
              "height": height,
              "data": image_64
            };
            return_variable = "" + callback + "(" + (JSON.stringify(return_variable)) + ");";
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=UTF-8'
            });
            return res.end(return_variable);
          }
        });
      }
    }
  };
  s = http.createServer(function(req, res) {
    var c, filename, r, u, url_parts;
    url_parts = url.parse(req.url, true);
    u = unescape(url_parts.query.url);
    c = url_parts.query.callback;
    if (!u || !c) {
      return res.end("url and callback must be defined", 400);
    } else {
      filename = "/tmp/" + u.substring(u.lastIndexOf('/') + 1);
      return r = request({
        uri: u,
        encoding: "binary"
      }, function(error, response, body) {
        return hResp(buf, filename, c, res, error, response, body);
      });
    }
  });
  s.listen(8087);
  console.log('Server running at http://maxvm.goip.ru:8087/');
}).call(this);
