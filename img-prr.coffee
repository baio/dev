express = require 'express'
gm = require 'gm'
http = require 'http'
fs = require 'fs'
r = require 'request'


class ImageProccessor
        
    TMP_FILE_NAME = "test.png"
    
    settings = 
        
        url : null
        
        callback : null
                
        proccess : null
        
    options = 
        
        request : null
        
        response : null
        
        settings : null
        
    #static method
    @Proccess : (options) ->
        imgPrr = new ImageProccessor options
        imgPrr.proccess()
            
    constructor: (@options) ->
        
        if options.request
            #get setting params from request
            @options.settings = @getSettings options.request
                        
    getSettings: (req) ->
                
        return {
            url : unescape req.param("url")
            callback : req.param "callback"
            proccess : req.param "proccess" }
            
    proccess: ->
        t = @
        r uri : @options.settings.url, encoding : "binary", httpModule : true,  (error, response, body) -> 
                    t.handleResponse error, response, body   
                    null
        #re.pipe fs.createWriteStream("test3.png")
            
    handleResponse: (error, response, image) ->
    
        if !error and response.statusCode == 200
    
            mimetype = response.headers["content-type"]
            
            if mimetype == "image/gif" or mimetype == "image/jpeg" or
                        mimetype == "image/jpg" or mimetype == "image/png" or mimetype == "image/tiff"
                      
                ws = fs.createWriteStream TMP_FILE_NAME, encoding : "binary"
                
                t = @
                
                img = new Buffer image.toString(), 'binary'
                
                ws.write img, (err, written, buffer) -> 
                    if !err
                        t.proccessImage()
                        t.sendResponse img, mimetype
            
    proccessImage: ->
                
    sendResponse: (image, mimetype) ->
        
        opt = @options
        
        # Get the image dimensions using GraphicsMagick
        gm(TMP_FILE_NAME).size (err, size) ->

            # Delete the tmp image
            fs.unlink TMP_FILE_NAME

            res = opt.response
            
            # Error getting dimensions
            if err
                 res.end err.message, 400
            else
                image_64 = "data:#{mimetype};base64,#{image.toString('base64')}"

                obj =
                    width : size.width
                    height : size.height
                    data : image_64

                res.writeHead 200, 'Content-Type' : 'application/json; charset=UTF-8'
                
                ret = "#{opt.settings.callback}(#{JSON.stringify(obj)});"
                
                res.end ret
                
                
app = express.createServer()


app.get '/', (req, res) ->
            ImageProccessor.Proccess request : req, response : res
        
app.listen 8087

console.log 'Server running at http://maxvm.goip.ru:8087/'


