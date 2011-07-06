//upload file with request module

var request = require('request');
var fs = require('fs')

var url= "http://nodejs.org/logo.png";

var r = request({uri:url, encoding : "binary"}, function (error, response, body) 
{
    if (!error && response.statusCode == 200) {
        
        var type_prefix = "data:" + response.headers["content-type"] + ";base64,";

    	var body_64 = type_prefix + new Buffer(body, "binary").toString('base64');
        
        console.log(body);
        console.log("===");
        console.log(body_64);      

        var ws = fs.createWriteStream('test-2.txt');
        ws.write(body);
        ws.write("\n===\n");
        ws.write(body_64);      

        ws.end();
    }
});

//s = r.pipe(fs.createWriteStream("test.data"));
