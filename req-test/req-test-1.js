//upload file with http
var http = require('http')
var fs = require('fs')

var options = {
  host: 'nodejs.org',
  port: 80,
  path: '/logo.png'
}

var request = http.get(options, function(res){
  res.setEncoding('binary')
  var imagedata = ''
  res.on('data', function (chunk) {
    imagedata += chunk; 
  })
  res.on('end', function(){
     
        var type_prefix = "data:" + res.headers["content-type"] + ";base64,";

		var imagedata_64 = type_prefix + new Buffer(imagedata, "binary").toString('base64');
        
        console.log(imagedata);
        console.log("===");
        console.log(imagedata_64);      

        var ws = fs.createWriteStream('test-1.txt');
        ws.write(imagedata);
        ws.write("\n===\n");
        ws.write(imagedata_64);      

        ws.end();
  })
})