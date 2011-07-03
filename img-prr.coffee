express = require 'express'
gm = require 'gm'
http = require 'http'
fs = require 'fs'
r = require 'request'


class ImageProcessor
        
    TMP_FILE_NAME = "test.png"
    
    settings = 
        
        url : null
        
        callback : null
                
        process : null
        
    options = 
        
        request : null
        
        response : null
        
        settings : null
        
    #static method
    @Process : (options) ->
        imgPrr = new ImageProcessor options
        imgPrr.proccess()
            
    constructor: (@options) ->
        
        if options.request
            #get setting params from request
            @options.settings = @getSettings options.request
                        
    getSettings: (req) ->
                
        return {
            url : unescape req.param("url")
            callback : req.param "callback"
            process : req.param "process" }
            
    getProcessor: (index) ->
        
        pr = @options.settings.process.split(";")[index]
        
        prr = pr.split '-'
        
        name : prr[0], prms : prr[1].split(',') if prr.length > 1
        
        
    getProcessorsCnt: () ->
        
        pr = @options.settings.process
        if pr then pr.split(";").length else 0
                            
    proccess: ->
        t = @
        r uri : @options.settings.url, encoding : "binary", httpModule : true,  (error, response, body) -> 
                    t.handleResponse error, response, body   
                    null
            
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
                        
                        t.processImage ->
                            # Get data from file, after proccessing
                            fs.readFile TMP_FILE_NAME, (err, data)->
                                  if !err 
                                    t.sendResponse data, mimetype
            
    processImage: (callback, index) ->
        
        #if first opertaion in stack 
        index ?= @getProcessorsCnt()
        
        #if last operation in stack
        if index == 0
            callback()
        else        
            index--
            
            dlg = @processImage
            
            prr = @getProcessor index
            
            gmf = gm TMP_FILE_NAME
            
            switch prr.name
                when "resize"  
                    if !prr.prms or prr.prms.length < 2 
                        console.log "prameters for resize not defined, can't resize image"
                    else 
                        prr.prms[2] = "%" if prr.prms[2]? and prr.prms[2] == "0"
                        gmf.resize(prr.prms[0], prr.prms[1], prr.prms[2]).write TMP_FILE_NAME, (err) ->
                            if !err then dlg callback, index
                else 
                    console.log "process #{prr.name} not found"
                    dlg callback, index
                    
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
            ImageProcessor.Process request : req, response : res
        
app.listen 8087

console.log 'Server running at http://maxvm.goip.ru:8087/'


