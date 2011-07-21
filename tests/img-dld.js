var request = require('request'),
    sys = require('sys'),
    fs = require('fs'),
    url = "http://nodejs.org/logo.png",
    express = require('express');

var app = express.createServer(
    express.logger()
);

    
app.get('/', function(req, res){

    // If a URL and callback parameters are present 
	if(req.param("url")/* && req.param("callback")*/) {

		// Get the parameters
		var url = unescape(req.param("url")),
		callback = req.param("callback");
        var opt = {uri:url, encoding:"binary"};
        var r = request(opt, function (error, response, body) 
        {
            if (!error && response.statusCode == 200) {
                
                console.log(body);
                
                console.log("****");
                
                fs.writeFile("test3.png", body);
                
                var type = response.headers["content-type"];
                /*
                var prefix = "data:" + type + ";base64,";
                var base64 = new Buffer(body, 'binary').toString('base64');
                var data = prefix + base64;
                */
                // Create the prefix for the data URL
            	var type_prefix = "data:" + type + ";base64,";
        
        		// Get the image from the response stream as a string and convert it to base64
        		var image = new Buffer(body, "binary");
        		var image_64 = image.toString('base64'); 
        
        		// Concat the prefix and the image
        		image_64 = type_prefix + image_64;
                
                console.log(image_64);
                
                var ws = fs.createWriteStream('test3.txt');
                ws.write(image_64);
                ws.end();
                
                var return_variable = {
    							"width": 100,
								"height": 100,
								"data": image_64
							};
                            
                var base64 = new Buffer(body, 'binary').toString('base64'),
                data = type_prefix + base64
                 obj = {
                "src": url.href,
                "data": data
                };

				// Stringifiy the return variable and wrap it in the callback for JSONP compatibility
				return_variable = JSON.stringify(obj);

				// Set the headers as OK and JS
				res.writeHead(200, {'Content-Type': 'application/javascript; charset=UTF-8'});

				// Return the data
				res.end(return_variable);

            }
        });
        
        //s = r.pipe(fs.createWriteStream("test3.png"), { encoding : "binary" });
	}
});

app.listen(8087);

