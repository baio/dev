(function() {
  var client_processes, processVM, server_processes, viewModel;
  client_processes = [
    {
      name: "Blend",
      disabled: true
    }, {
      name: "Blur"
    }, {
      name: "BlurFast",
      def: {
        amount: 0.5
      }
    }, {
      name: "Brightness",
      def: {
        brightness: 50,
        contrast: 0.5
      }
    }, {
      name: "ColorAdjust",
      def: {
        red: 0.5,
        green: 0,
        blue: 0
      }
    }, {
      name: "ColorHistogram",
      disabled: true
    }, {
      name: "Crop",
      def: {
        rect: {
          left: 50,
          top: 50,
          width: 50,
          height: 50
        }
      }
    }, {
      name: "Desaturate",
      def: {
        average: false
      }
    }, {
      name: "EdgeDetection",
      def: {
        mono: true,
        invert: false
      }
    }, {
      name: "EdgeDetection2"
    }, {
      name: "Emboss",
      def: {
        greyLevel: 100,
        direction: "topright"
      }
    }, {
      name: "FlipH"
    }, {
      name: "FlipV"
    }, {
      name: "Glow",
      def: {
        amount: 0.5,
        radius: 1.0
      }
    }, {
      name: "Histogram",
      disabled: true
    }, {
      name: "Hue",
      def: {
        hue: 30,
        saturation: 20,
        lightness: 0
      }
    }, {
      name: "Invert"
    }, {
      name: "Laplace",
      def: {
        edgeStrength: 0.5,
        invert: false,
        greyLevel: 0
      }
    }, {
      name: "Lighten",
      def: {
        amount: 0.5
      }
    }, {
      name: "Mosaic",
      def: {
        blockSize: 10
      }
    }, {
      name: "Noise",
      def: {
        mono: true,
        amount: 0.5,
        strength: 0.5
      }
    }, {
      name: "Pointillize",
      disabled: true
    }, {
      name: "Posterize",
      def: {
        levels: 10
      }
    }, {
      name: "RemoveNoise"
    }, {
      name: "Sepia"
    }, {
      name: "Sharpen",
      def: {
        amount: 0.5
      }
    }, {
      name: "Solarize"
    }, {
      name: "UnsharpMask",
      def: {
        amount: 0.5,
        radius: 1,
        treshold: 100
      }
    }
  ];
  server_processes = [
    "bitdepth", "blur", {
      name: "changeFormat",
      disabled: true
    }, "charcoal", "chop", "colorize", "colors", "comment", "contrast", "crop", "cycle", "despeckle", "dither", "draw", "edge", "emboss", "enhance", "equalize", "flip", "flop", "gamma", "implode", "label", "limit", "lower", "magnify", "median", "minify", "modulate", "monochrome", {
      name: "morph",
      disabled: true
    }, "negative", {
      name: "new",
      disabled: true
    }, "noise", "paint", "quality", "raise", "region", "resample", "resize", "roll", "rotate", "scale", "sepia", "sharpen", "solarize", "spread", "swirl", {
      name: "thumb",
      disabled: true
    }
  ];
  processVM = function(obj) {
    this.name = obj.name ? obj.name : obj;
    this.def = obj.def ? JSON.stringify(obj.def) : null;
    this.enabled = obj.disabled ? !obj.disabled : true;
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
          process: $.trim($e.next().text().toLowerCase()),
          params: $.trim($e.next().next().val())
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
        server: "http://maxvm2.goip.ru:8087",
        src: $("#img_url").val(),
        process: srvParams,
        animateCss: $("#animate_img").attr("checked") ? "img-prr-animated" : void 0,
        success: function(img, errors) {
          var himg, p, _k, _len3;
          himg = $(img);
          for (_k = 0, _len3 = cltParams.length; _k < _len3; _k++) {
            p = cltParams[_k];
            himg = himg.pixastic(p.process, p.params ? eval('(' + p.params + ')') : null);
          }
          $("#prc_errors").text("");
          $("#prc_errors").text(errors.join("---\n"));
          return himg;
        }
      });
    });
  });
}).call(this);
