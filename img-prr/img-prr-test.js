(function() {
  var client_processes, processVM, server_processes, viewModel;
  client_processes = ["Blend", "Blur", "BlurFast", "Brightness", "ColorAdjust", "ColorHistogram", "Crop", "Desaturate", "EdgeDetection", "EdgeDetection2", "Emboss", "Flip", "Horizontally", "FlipVertically", "Glow", "Histogram", "Hue", "Saturation", "Lightness", "Invert", "LaplaceEdgeDetection", "Lighten", "Mosaic", "Noise", "Pointillize", "Posterize", "RemoveNoise", "Sepia", "Sharpen", "Solarize", "Unsharp", "Mask"];
  server_processes = ["bitdepth", "blur", "changeFormat", "charcoal", "chop", "colorize", "colors", "comment", "contrast", "crop", "cycle", "despeckle", "dither", "draw", "edge", "emboss", "enhance", "equalize", "flip", "flop", "gamma", "getters", "implode", "label", "limit", "lower", "magnify", "median", "minify", "modulate", "monochrome", "morph", "negative", "new", "noise1", "noise2", "paint", "quality", "raise", "region", "resample", "resize", "roll", "rotate", "scale", "sepia", "sharpen", "solarize", "spread", "swirl", "thumb"];
  processVM = function(name) {
    this.name = name;
    this.checked = ko.observable(false);
    this.params = ko.observable(null);
    return null;
  };
  viewModel = {
    cltProcesses: ko.observableArray($.map(client_processes, function(p) {
      return new processVM(p);
    })),
    srvProcesses: ko.observableArray($.map(server_processes, function(p) {
      return new processVM(p);
    }))
  };
  ko.applyBindings(viewModel);
  $(function() {
    return $("#img_process").click(function() {
      var $e, cltParams, e, params, srvParams, _i, _j, _len, _len2, _ref, _ref2;
      $("#img_src")[0].src = $("#img_url").val();
      cltParams = new Array();
      srvParams = "";
      _ref = $("#options_clt :checked");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        $e = $(e);
        cltParams.push({
          process: $e.next().text(),
          params: $e.next().next().val()
        });
      }
      _ref2 = $("#options_srv :checked");
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        e = _ref2[_j];
        $e = $(e);
        srvParams += $.trim($e.next().text());
        params = $.trim($e.next().next().val());
        if (params) {
          srvParams += "-" + params;
        }
        srvParams += ";";
      }
      $("#img_dest").imageProcessor("destroy");
      return $("#img_dest").imageProcessor({
        server: "http://maxvm.goip.ru:8087",
        src: $("#img_url").val(),
        process: srvParams,
        animateCss: "img-prr-animated",
        success: function(img) {
          var himg, p, _i, _len;
          for (_i = 0, _len = cltParams.length; _i < _len; _i++) {
            p = cltParams[_i];
            himg = $(img).pixastic(p.process, p.params);
          }
          return himg;
        }
      });
    });
  });
}).call(this);
