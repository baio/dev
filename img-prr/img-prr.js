(function() {
  var ImageProcessor, fs, gm, http, req, srv, uri, utils960gs, utilsSize;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  gm = require('gm');
  http = require('http');
  fs = require('fs');
  req = require('request');
  uri = require('url');
  utilsSize = (function() {
    function utilsSize() {}
    utilsSize.getHeight = function(origSize, width) {
      return Math.floor(origSize.height * (width / origSize.width));
    };
    utilsSize.fitSize = function(origSize, szList) {
      var checkRange, i, sz, _ref;
      checkRange = function(orig, szp, sz, szn) {
        var r;
        if (!szn) {
          return true;
        }
        if (szp == null) {
          szp = 0;
        }
        r = {
          left: sz - (sz - szp) / 2,
          right: szn - (szn - sz) / 2
        };
        return (r.left < orig && orig <= r.right);
      };
      sz = {
        width: origSize.width,
        height: origSize.height
      };
      for (i = 0, _ref = szList.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (checkRange(origSize.width, szList[i - 1], szList[i], szList[i + 1])) {
          break;
        }
      }
      sz.width = szList[i];
      sz.height = this.getHeight(origSize, sz.width);
      return sz;
    };
    return utilsSize;
  })();
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
      h = utilsSize.getHeight(origSize, w);
      return {
        width: w,
        height: h
      };
    };
    utils960gs.fitSize = function(origSize, colList) {
      var c, colNums, sz;
      colNums = Math.floor(origSize.width / 80);
      if (colNums === 0) {
        colNums = 1;
      }
      if (colNums > 12) {
        colNums = 12;
      }
      sz = this.getSize(origSize, colNums);
      if (sz.height > 300) {
        sz.height = 300;
        sz.width = Math.floor(origSize.width * (sz.height / origSize.height));
        sz = this.fitSize(sz);
      }
      if (colList) {
        sz = utilsSize.fitSize(origSize, (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = colList.length; _i < _len; _i++) {
            c = colList[_i];
            _results.push(this.getWidth(c));
          }
          return _results;
        }).call(this));
      }
      return sz;
    };
    return utils960gs;
  })();
  ImageProcessor = (function() {
    var TMP_FILE_NAME, errors, options, processes, settings;
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
    errors = [];
    processes = ["bitdepth", "blur", "changeFormat", "charcoal", "chop", "colorize", "colors", "comment", "contrast", "crop", "cycle", "despeckle", "dither", "draw", "edge", "emboss", "enhance", "equalize", "flip", "flop", "gamma", "implode", "label", "limit", "lower", "magnify", "median", "minify", "modulate", "monochrome", "morph", "negative", "new", "noise", "paint", "quality", "raise", "region", "resample", "roll", "rotate", "scale", "sepia", "sharpen", "solarize", "spread", "swirl", "thumb"];
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
      var query, url;
      query = uri.parse(req.url, true).query;
      url = query.url;
      TMP_FILE_NAME = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);
      return {
        url: url,
        callback: query.callback,
        process: query.process
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
      var arr, pr;
      pr = this.options.settings.process;
      if (pr) {
        arr = pr.split(";");
        if (arr[arr.length - 1]) {
          return arr.length;
        } else {
          return arr.length - 1;
        }
      } else {
        return 0;
      }
    };
    ImageProcessor.prototype.proccess = function() {
      console.log("2");
      errors = [];
      return req({
        uri: this.options.settings.url,
        encoding: "binary"
      }, __bind(function(error, response, body) {
        this.handleResponse(error, response, body);
        return null;
      }, this));
    };
    ImageProcessor.prototype.handleResponse = function(error, response, image) {
      var img, mimetype, ws;
      console.log("3");
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
    ImageProcessor.prototype.processImage = function(callback, idx) {
      var index, prc, prr, _i, _len;
      index = idx != null ? idx : this.getProcessorsCnt() - 1;
      if (index === -1) {
        return this.endProcessImage(callback, index);
      }
      prr = this.getProcessor(index);
      for (_i = 0, _len = processes.length; _i < _len; _i++) {
        prc = processes[_i];
        if (prc === prr.name) {
          return this.processing(prr.name, prr.prms, callback, index);
        }
      }
      switch (prr.name) {
        case "resize":
          return this.resize(prr.prms, callback, index);
        default:
          return this.endProcessImage(callback, index, "process " + prr.name + " not found");
      }
    };
    ImageProcessor.prototype.endProcessImage = function(callback, index, error) {
      var err;
      if (!error) {
        if (index >= 0) {
          console.log("Image proccess [" + (this.getProcessor(index).name) + "]  step " + index + " success");
        }
      } else {
        err = "Image proccess [" + (this.getProcessor(index).name) + "] setp " + index + " fails:\n" + error;
        console.log(err);
        errors.push(err);
      }
      if (index < 1) {
        return callback();
      } else {
        return this.processImage(callback, --index);
      }
    };
    ImageProcessor.prototype.processing = function(processName, prms, callback, index) {
      var func, g;
      try {
        console.log("processing " + processName);
        g = gm(TMP_FILE_NAME);
        func = eval("g." + processName);
        return func.apply(g, prms).write(TMP_FILE_NAME, __bind(function(err) {
          return this.endProcessImage(callback, index, err);
        }, this));
      } catch (msg) {
        return this.endProcessImage(callback, index, "process " + processName + " failed with error " + msg);
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
        if (height == null) {
          height = width;
        }
      }
      switch (fmt) {
        case "%":
          break;
        case "px":
          fmt = null;
          if (width.indexOf("|" !== -1)) {
            gm(TMP_FILE_NAME).size(__bind(function(err, size) {
              var sz;
              if (!err) {
                sz = utilsSize.fitSize(size, width.split("|"));
                console.log("px calculated : width: " + size.width + " -> " + sz.width + " height: " + size.height + " -> " + sz.height);
                return this.resize(sz, callback, index);
              }
            }, this));
          }
          return;
        case "960gs":
          gm(TMP_FILE_NAME).size(__bind(function(err, size) {
            var sz;
            if (!err) {
              if (width === "fit") {
                sz = utils960gs.fitSize(size);
              } else if (width.indexOf("|" !== -1)) {
                sz = utils960gs.fitSize(size, width.split("|"));
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
            errors: errors,
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
  /*
  app = express.createServer()
  
  
  app.get '/', (req, res) ->
              ImageProcessor.Process request : req, response : res
          
  app.listen 8087
  */
  srv = http.createServer(function(req, res) {
    console.log("1");
    return ImageProcessor.Process({
      request: req,
      response: res
    });
  });
  srv.listen(8089);
  console.log('Server running at http://dataavail.com:8089/');
}).call(this);
