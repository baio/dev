(function() {
  $(function() {
    return $("#img_process").click(function() {
      var $e, cltParams, e, params, srvParams, _i, _j, _len, _len2, _ref, _ref2;
      $("#img_src")[0].src = $("#img_url").val();
      cltParams = new Array();
      srvParams = "";
      _ref = $("#params :checked");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        $e = $(e);
        if ($e.next().attr("type") === "checkbox") {
          cltParams.push({
            process: $e.parent().text(),
            params: $e.parent().next().children(":input").val()
          });
        }
      }
      _ref2 = $("#params :checked");
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        e = _ref2[_j];
        $e = $(e);
        if ($e.next().attr("type") !== "checkbox") {
          srvParams += $e.parent().text();
          params = $e.parent().next().children(":input").val();
          if (params) {
            srvParams += "-" + params;
          }
        }
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
