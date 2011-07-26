(function() {
  $(function() {
    return $(".animated").imageProcessor({
      server: "http://maxvm.goip.ru:8087",
      animateCss: "img-prr-animated",
      success: function(img, errors) {
        var himg;
        himg = $(img);
        himg = himg.pixastic("desaturate");
        himg = himg.pixastic("blur");
        return himg;
      }
    });
  });
}).call(this);
