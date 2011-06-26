(function() {
  var http, request, s;
  http = require('http');
  request = require('request');
  s = http.createServer(function(req, res) {
    return request({
      uri: "http://www.anvari.org/db/cols/The_Simpsons_Characters_Picture_Gallery/Blinky.png"
    }, function(error, response, body) {
      var filename, height, image, image_64, out, type_prefix, width;
      if (!error && response.statusCode === 200) {
        type_prefix = "data:" + mimetype + ";base64,";
        if (mimetype === "image/gif" || mimetype === "image/jpeg" || mimetype === "image/jpg" || mimetype === "image/png" || mimetype === "image/tiff") {
          image = new Buffer(bl.toString(), 'binary');
          image_64 = image.toString('base64');
          image_64 = type_prefix + image_64;
          width = 0;
          height = 0;
          filename = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);
          out = fs.createWriteStream(filename);
          out.write(image);
          out.end();
          return gm(filename).size(function(err, size) {
            var return_variable;
            fs.unlink(filename);
            if (err) {
              return res.send("Error getting image dimensions", 400);
            } else {
              width = size.width;
              height = size.height;
              return_variable = {
                "width": width,
                "height": height,
                "data": image_64
              };
              return_variable = callback + "(" + JSON.stringify(return_variable) + ");";
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=UTF-8'
              });
              return res.end(return_variable);
            }
          });
        }
      }
    });
  });
  s.listen(8087);
  console.log('Server running at http://maxvm.goip.ru:8087/');
}).call(this);
