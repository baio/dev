(function() {
  var ImageProccessor, app, express, fs, gm, http, r;
  express = require('express');
  gm = require('gm');
  http = require('http');
  fs = require('fs');
  r = require('request');
  ImageProccessor = (function() {
    var TMP_FILE_NAME, options, settings;
    TMP_FILE_NAME = "test.png";
    settings = {
      url: null,
      callback: null,
      proccess: null
    };
    options = {
      request: null,
      response: null,
      settings: null
    };
    ImageProccessor.Proccess = function(options) {
      var imgPrr;
      imgPrr = new ImageProccessor(options);
      return imgPrr.proccess();
    };
    function ImageProccessor(options) {
      this.options = options;
      if (options.request) {
        this.options.settings = this.getSettings(options.request);
      }
    }
    ImageProccessor.prototype.getSettings = function(req) {
      return {
        url: unescape(req.param("url")),
        callback: req.param("callback"),
        proccess: req.param("proccess")
      };
    };
    ImageProccessor.prototype.proccess = function() {
      var t;
      t = this;
      return r({
        uri: this.options.settings.url,
        encoding: "binary",
        httpModule: true
      }, function(error, response, body) {
        t.handleResponse(error, response, body);
        return null;
      });
    };
    ImageProccessor.prototype.handleResponse = function(error, response, image) {
      var img, mimetype, t, ws;
      if (!error && response.statusCode === 200) {
        mimetype = response.headers["content-type"];
        if (mimetype === "image/gif" || mimetype === "image/jpeg" || mimetype === "image/jpg" || mimetype === "image/png" || mimetype === "image/tiff") {
          ws = fs.createWriteStream(TMP_FILE_NAME, {
            encoding: "binary"
          });
          t = this;
          img = new Buffer(image.toString(), 'binary');
          return ws.write(img, function(err, written, buffer) {
            if (!err) {
              return t.proccessImage(function() {
                return fs.readFile(TMP_FILE_NAME, function(err, data) {
                  if (!err) {
                    return t.sendResponse(data, mimetype);
                  }
                });
              });
            }
          });
        }
      }
    };
    ImageProccessor.prototype.proccessImage = function(callback, index) {
      var dlg;
            if (index != null) {
        index;
      } else {
        index = 1;
      };
      if (index === 0) {
        return callback();
      } else {
        index--;
        dlg = this.proccessImage;
        return gm(TMP_FILE_NAME).resize(50, 50, '%').write(TMP_FILE_NAME, function(err) {
          if (!err) {
            return dlg(callback, index);
          }
        });
      }
    };
    ImageProccessor.prototype.sendResponse = function(image, mimetype) {
      var opt;
      opt = this.options;
      return gm(TMP_FILE_NAME).size(function(err, size) {
        var image_64, obj, res, ret;
        fs.unlink(TMP_FILE_NAME);
        res = opt.response;
        if (err) {
          return res.end(err.message, 400);
        } else {
          image_64 = "data:" + mimetype + ";base64," + (image.toString('base64'));
          obj = {
            width: size.width,
            height: size.height,
            data: image_64
          };
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=UTF-8'
          });
          ret = "" + opt.settings.callback + "(" + (JSON.stringify(obj)) + ");";
          return res.end(ret);
        }
      });
    };
    return ImageProccessor;
  })();
  app = express.createServer();
  app.get('/', function(req, res) {
    return ImageProccessor.Proccess({
      request: req,
      response: res
    });
  });
  app.listen(8087);
  console.log('Server running at http://maxvm.goip.ru:8087/');
}).call(this);
