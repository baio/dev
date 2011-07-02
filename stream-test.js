var request = require('request'),
    sys = require('sys'),
    fs = require('fs'),
    url = "http://nodejs.org/logo.png",
    express = require('express');

var app = express.createServer(
    express.logger()
);
    
app.get('/', function(req, res){
   
   
        //This works
        var r = request({uri:url,encoding:"binary"}, function (error, response, body) 
        {
            if (!error && response.statusCode == 200) {
                
                console.log(body);                
            }
        });
        
        //And this not
        /*

        var r = request({uri:url}, function (error, response, body) 
        {
            if (!error && response.statusCode == 200) {
                
                console.log(body);                
            }
        });

        
        r.pipe(fs.createWriteStream("test3.png"), encoding="binary");
        */
        
        
	});

app.listen(8087);

