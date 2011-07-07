(function() {
  var ImageProcessor, app, express, fs, gm, http, r, utils960gs;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  express = require('express');
  gm = require('gm');
  http = require('http');
  fs = require('fs');
  r = require('request');
  utils960gs = (function() {
    function utils960gs() {}
    utils960gs.getWidth = function(colNums) {
      return colNums * 60 + (colNums - 1) * 20;
    };
    utils960gs.getHeight = function(origSize, width) {
      return Math.floor(origSize.height * (width / origSize.width));
    };
    utils960gs.getSize = function(origSize, colNums) {
      var h, w;
      w = this.getWidth(colNums);
      h = this.getHeight(origSize, w);
      return {
        width: w,
        height: h
      };
    };
    utils960gs.fitSize = function(origSize) {
      var colNums;
      colNums = Math.floor(origSize.width / 80);
      if (colNums === 0) {
        colNums = 1;
      }
      if (colNums > 12) {
        colNums = 12;
      }
      return this.getSize(origSize, colNums);
    };
    return utils960gs;
  })();
  ImageProcessor = (function() {
    var TMP_FILE_NAME, options, settings;
    TMP_FILE_NAME = null;
    settings = {
      url: null,
      callback: null,
      process: null
    };
    options = {
      request: null,
      response: null,
      settings: null
    };
    ImageProcessor.Process = function(options) {
      var imgPrr;
      imgPrr = new ImageProcessor(options);
      return imgPrr.proccess();
    };
    function ImageProcessor(options) {
      this.options = options;
      if (options.request) {
        this.options.settings = this.getSettings(options.request);
      }
    }
    ImageProcessor.prototype.getSettings = function(req) {
      var url;
      url = req.param("url");
      TMP_FILE_NAME = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);
      return {
        url: url,
        callback: req.param("callback"),
        process: req.param("process")
      };
    };
    ImageProcessor.prototype.getProcessor = function(index) {
      var pr, prr;
      pr = this.options.settings.process.split(";")[index];
      prr = pr.split('-');
      return {
        name: prr[0],
        prms: prr.length > 1 ? prr[1].split(',') : void 0
      };
    };
    ImageProcessor.prototype.getProcessorsCnt = function() {
      var pr;
      pr = this.options.settings.process;
      if (pr) {
        return pr.split(";").length;
      } else {
        return 0;
      }
    };
    ImageProcessor.prototype.proccess = function() {
      return r({
        uri: this.options.settings.url,
        encoding: "binary",
        httpModule: true
      }, __bind(function(error, response, body) {
        this.handleResponse(error, response, body);
        return null;
      }, this));
    };
    ImageProcessor.prototype.handleResponse = function(error, response, image) {
      var img, mimetype, ws;
      if (!error && response.statusCode === 200) {
        mimetype = response.headers["content-type"];
        if (mimetype === "image/gif" || mimetype === "image/jpeg" || mimetype === "image/jpg" || mimetype === "image/png" || mimetype === "image/tiff") {
          ws = fs.createWriteStream(TMP_FILE_NAME, {
            encoding: "binary"
          });
          img = new Buffer(image.toString(), 'binary');
          return ws.write(img, __bind(function(err, written, buffer) {
            if (!err) {
              return this.processImage(__bind(function() {
                return fs.readFile(TMP_FILE_NAME, __bind(function(err, data) {
                  if (!err) {
                    return this.sendResponse(data, mimetype);
                  }
                }, this));
              }, this));
            }
          }, this));
        }
      }
    };
    ImageProcessor.prototype.processImage = function(callback, index) {
      var prr;
            if (index != null) {
        index;
      } else {
        index = this.getProcessorsCnt() - 1;
      };
      prr = this.getProcessor(index);
      switch (prr.name) {
        case "resize":
          return this.resize(prr.prms, callback, index);
        default:
          return this.endProcessImage(callback, index, "process " + prr.name + " not found");
      }
    };
    ImageProcessor.prototype.endProcessImage = function(callback, index, error) {
      if (!error) {
        console.log("Image proccess setp " + index + " success");
      } else {
        console.log("Image proccess setp " + index + " fails:\n" + error);
      }
      if (index === 0) {
        return callback();
      } else {
        return this.processImage(callback, index--);
      }
    };
    ImageProcessor.prototype.resize = function(prms, callback, index) {
      var fmt, height, width;
      if (prms.width) {
        width = prms.width;
        height = prms.height;
        fmt = null;
      } else {
        if (!prms || prms.length < 1 || !prms[0]) {
          this.endProcessImage(callback, index, "prameters for resize not defined, can't resize image");
          return;
        }
        width = prms[0];
        if (!isNaN(prms[1])) {
          height = prms[1];
          fmt = prms[2];
        } else {
          fmt = prms[1];
        }
                if (height != null) {
          height;
        } else {
          height = width;
        };
      }
      switch (fmt) {
        case "%":
          break;
        case "px":
          fmt = null;
          break;
        case "960gs":
          gm(TMP_FILE_NAME).size(__bind(function(err, size) {
            var sz;
            if (!err) {
              if (width === "fit") {
                sz = utils960gs.fitSize(size);
              } else {
                sz = utils960gs.getSize(size, width);
              }
              console.log("960gs calculated : width: " + size.width + " -> " + sz.width + " height: " + size.height + " -> " + sz.height);
              return this.resize(sz, callback, index);
            } else {
              return this.endProcessImage(callback, index, err);
            }
          }, this));
          return;
        default:
          console.log("format " + fmt + " not found will be used px");
          fmt = null;
      }
      console.log("width: " + width + " height: " + height + " format: " + fmt);
      return gm(TMP_FILE_NAME).resize(width, height, fmt).write(TMP_FILE_NAME, __bind(function(err) {
        return this.endProcessImage(callback, index, err);
      }, this));
    };
    ImageProcessor.prototype.sendResponse = function(image, mimetype) {
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
    return ImageProcessor;
  })();
  app = express.createServer();
  app.get('/', function(req, res) {
    return ImageProcessor.Process({
      request: req,
      response: res
    });
  });
  app.listen(8087);
  console.log('Server running at http://maxvm.goip.ru:8087/');
}).call(this);
