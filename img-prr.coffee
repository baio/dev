
require.paths.unshift(__dirname + '/lib/')

http = require 'http'
request = require 'request'

BufferList = require('bufferlist').BufferList
gm = require 'gm'
http = require 'http'
fs = require 'fs'
sys = require 'sys'

hResp = (filename, res, error, response, body) ->
    
    if !error and response.statusCode == 200
    
        mimetype = response.headers["content-type"];
        
        if mimetype == "image/gif" or mimetype == "image/jpeg" or
    		        mimetype == "image/jpg" or mimetype == "image/png" or mimetype == "image/tiff"
    
            type_prefix = "data:" + mimetype + ";base64,"
            # Get the image from the response stream as a string and convert it to base64
    
            image = new Buffer body.toString(), 'binary'
            image_64 = image.toString 'base64'
    
            # Concat the prefix and the image
            image_64 = type_prefix + image_64
    
            # Set width and height to 0
            width = 0
            height = 0
        
            # Get the image dimensions using GraphicsMagick
            gm(filename).size (err, size)->
    
                # Delete the tmp image
                fs.unlink filename
    
                # Error getting dimensions
                if err
                     response.end err, 400
                else
                    width = size.width
                    height = size.height
    
                    #The data to be returned
                    return_variable =
                        "width": width
                        "height": height
                        "data": image_64
    
                    # Stringifiy the return variable and wrap it in the callback for JSONP compatibility
                    return_variable = "callback" + "(" + JSON.stringify(return_variable) + ");"
    
                    # Set the headers as OK and JS
                    res.writeHead 200, 'Content-Type' : 'application/json; charset=UTF-8'
    
                    #Return the data
                    res.end return_variable
    

s = http.createServer (req, res) ->
        callback = "_get"
        url = "http://img.lenta.ru/i/logowrambler.gif"
        # Get the image filename
        filename = "/tmp/" + url.substring url.lastIndexOf('/') + 1
        r = request uri : url,  (error, response, body) -> 
            hResp filename, res, error, response, body
        r.pipe  fs.createWriteStream(filename)                   
s.listen 8087
console.log 'Server running at http://maxvm.goip.ru:8087/'

