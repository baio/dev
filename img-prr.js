(function() {
  var BufferList, fs, gm, hResp, http, request, s, sys;
  require.paths.unshift(__dirname + '/lib/');
  http = require('http');
  request = require('request');
  BufferList = require('bufferlist').BufferList;
  gm = require('gm');
  http = require('http');
  fs = require('fs');
  sys = require('sys');
  hResp = function(filename, res, error, response, body) {
    var height, image, image_64, mimetype, type_prefix, width;
    if (!error && response.statusCode === 200) {
      mimetype = response.headers["content-type"];
      if (mimetype === "image/gif" || mimetype === "image/jpeg" || mimetype === "image/jpg" || mimetype === "image/png" || mimetype === "image/tiff") {
        type_prefix = "data:" + mimetype + ";base64,";
        image = new Buffer(body.toString(), 'binary');
        image_64 = image.toString('base64');
        image_64 = type_prefix + image_64;
        width = 0;
        height = 0;
        return gm(filename).size(function(err, size) {
          var return_variable;
          fs.unlink(filename);
          if (err) {
            return response.end(err, 400);
          } else {
            width = size.width;
            height = size.height;
            return_variable = {
              "width": width,
              "height": height,
              "data": image_64
            };
            return_variable = "callback" + "(" + JSON.stringify(return_variable) + ");";
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
    var callback, filename, r, url;
    callback = "_get";
    url = "http://img.lenta.ru/i/logowrambler.gif";
    filename = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);
    r = request({
      uri: url
    }, function(error, response, body) {
      return hResp(filename, res, error, response, body);
    });
    return r.pipe(fs.createWriteStream(filename));
  });
  s.listen(8087);
  console.log('Server running at http://maxvm.goip.ru:8087/');
}).call(this);
