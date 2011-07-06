(function() {
  $.fn.extend({
    greyImages: function() {
      var supportsCanvas;
      supportsCanvas = document.createElement('canvas').getContext;
      if (supportsCanvas != null) {
        throw "greyImages.browser doesn't support canvas";
        return this.each(function() {
          var ctx, grey, i, imageData, img, length, px, _ref;
          ctx = document.getElementsByTagName("canvas")[0].getContext('2d');
          img = document.getElementById("cvs-src");
          ctx.drawImage(img, 0, 0);
          imageData = ctx.getImageData(0, 0, 500, 500);
          px = imageData.data;
          length = px.length;
          for (i = 0, _ref = length - 1; (0 <= _ref ? i <= _ref : i >= _ref); i += 4) {
            grey = px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11;
            px[i] = px[i + 1] = px[i + 2] = grey;
          }
          return ctx.putImageData(imageData, 0, 0);
        });
      }
    }
  });
}).call(this);
