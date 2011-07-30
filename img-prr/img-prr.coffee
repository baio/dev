express = require 'express'
gm = require 'gm'
http = require 'http'
fs = require 'fs'
r = require 'request'
#gs960 = require './utils960gs'

class utils960gs

    @getWidth: (colNums) ->
        colNums * 60 + (colNums - 1) * 20

    @getHeight: (origSize, width) ->
        Math.floor origSize.height * (width / origSize.width)

    @getSize: (origSize, colNums) ->
        w = @getWidth colNums
        h = @getHeight origSize, w
        width : w, height : h

    @fitSize: (origSize, colList) ->
        colNums = Math.floor origSize.width / 80
        colNums = 1 if colNums == 0
        colNums = 12  if colNums > 12
        sz = @getSize origSize, colNums
        if sz.height > 300
            sz.height = 300
            sz.width = Math.floor origSize.width * (sz.height / origSize.height)
            sz = @fitSize sz
        
        if colList
             
             for c in colList
                break if @getWidth(c) >= sz.width
                                           
             sz.width = @getWidth c
             sz.height = @getHeight origSize, sz.width
        sz

class ImageProcessor
        
    TMP_FILE_NAME = null
    
    settings = 
        
        url : null
        
        callback : null
                
        process : null
        
    options = 
        
        request : null
        
        response : null
        
        settings : null
        
    errors = []
        
    processes = [
        
        "bitdepth"
        
        "blur"
        
        "changeFormat"
        
        "charcoal"
        
        "chop"
        
        "colorize"
        
        "colors"
        
        "comment"
        
        "contrast"
        
        "crop"
        
        "cycle"
        
        "despeckle"
        
        "dither"
        
        "draw"
        
        "edge"
        
        "emboss"
        
        "enhance"
        
        "equalize"
        
        "flip"
         
        "flop"
        
        "gamma"
        
        "implode"
        
        "label"
        
        "limit"
        
        "lower"
        
        "magnify"

        "median"

        "minify"

        "modulate"

        "monochrome"

        "morph"

        "negative"

        "new"

        "noise"

        "paint"

        "quality"

        "raise"

        "region"

        "resample"

        #"resize" sepcial case

        "roll"

        "rotate"

        "scale"

        "sepia"

        "sharpen"

        "solarize"

        "spread"

        "swirl"

        "thumb"
    ]

        
    #static method
    @Process : (options) ->
        imgPrr = new ImageProcessor options
        imgPrr.proccess()
            
    constructor: (@options) ->
        
        if options.request
            #get setting params from request
            @options.settings = @getSettings options.request
                        
    getSettings: (req) ->
            url = req.param("url")
            TMP_FILE_NAME = "/tmp/" + url.substring url.lastIndexOf('/') + 1
            return {
                url : url
                callback : req.param "callback"
                process : req.param "process" }

    getProcessor: (index) ->
        
        pr = @options.settings.process.split(";")[index]
        
        prr = pr.split '-'
        
        name : prr[0], prms : prr[1].split(',') if prr.length > 1
        
        
    getProcessorsCnt: () ->
        
        pr = @options.settings.process
        if pr 
            arr = pr.split(";")
            return if arr[arr.length - 1] then arr.length else arr.length - 1
        else 
            0
                            
    proccess: ->
        errors = []
        r uri : @options.settings.url, encoding : "binary",  (error, response, body) => 
                    @handleResponse error, response, body   
                    null
            
    handleResponse: (error, response, image) ->
    
        if !error and response.statusCode == 200
    
            mimetype = response.headers["content-type"]
            
            if mimetype == "image/gif" or mimetype == "image/jpeg" or
                        mimetype == "image/jpg" or mimetype == "image/png" or mimetype == "image/tiff"
                      
                ws = fs.createWriteStream TMP_FILE_NAME, encoding : "binary"
                                
                img = new Buffer image.toString(), 'binary'
                
                ws.write img, (err, written, buffer) =>
                    if !err
                        @processImage =>
                            # Get data from file, after proccessing
                            fs.readFile TMP_FILE_NAME, (err, data)=>
                                  if !err
                                    @sendResponse data, mimetype
                                            
    processImage: (callback, idx) ->
        
        #if first opertaion in stack 
        
        index = if idx? then idx else @getProcessorsCnt() - 1 
        
        if index == -1
            return @endProcessImage callback, index
                    
        prr = @getProcessor index

        for prc in processes
            if prc == prr.name
                return @processing prr.name, prr.prms, callback, index
                    
        switch prr.name
            when "resize"  
                    @resize prr.prms, callback, index
            else 
                @endProcessImage callback, index, "process #{prr.name} not found"
                
    endProcessImage: (callback, index, error) ->    
        if !error 
            if index >= 0
                console.log "Image proccess [#{@getProcessor(index).name}]  step #{index} success"
        else
            err = "Image proccess [#{@getProcessor(index).name}] setp #{index} fails:\n#{error}"
            console.log err
            errors.push err
        
        if index < 1
            callback()
        else        
            @processImage callback, --index
            
                        
    processing: (processName, prms, callback, index) ->
            
            
            try
                console.log "processing #{processName}"    
                
                g = gm TMP_FILE_NAME
                    
                func = eval "g.#{processName}"
                            
                func.apply(g, prms).write TMP_FILE_NAME, (err) =>
                    @endProcessImage callback, index, err
            
            
            catch msg
                @endProcessImage callback, index, "process #{processName} failed with error #{msg}"
        

    resize: (prms, callback, index) ->

        if prms.width
            #get this call from "960gs" size 
            width = prms.width
            height = prms.height
            fmt = null
        else            
            if !prms or prms.length < 1 or !prms[0]
                @endProcessImage callback, index, "prameters for resize not defined, can't resize image"
                return

            width = prms[0]
                        
            if !isNaN prms[1]
                height = prms[1]
                fmt = prms[2]
            else
                fmt = prms[1]
                
            height ?= width
            
        switch fmt
            when "%" then break
            when "px" then fmt = null
            when "960gs" 
                gm(TMP_FILE_NAME).size (err, size) =>
                    if !err
                        if width == "fit" 
                            sz = utils960gs.fitSize size 
                        else if width.indexOf "|" != -1
                            sz = utils960gs.fitSize size, width.split "|"
                        else
                            sz = utils960gs.getSize size, width
                        
                        console.log "960gs calculated : width: #{size.width} -> #{sz.width} height: #{size.height} -> #{sz.height}"
                        
                        @resize sz, callback, index
                    else
                        @endProcessImage callback, index, err
                return;
            else
                console.log "format #{fmt} not found will be used px"
                fmt = null

        console.log "width: #{width} height: #{height} format: #{fmt}"
                
        gm(TMP_FILE_NAME).resize(width, height, fmt).write TMP_FILE_NAME, (err) =>
            @endProcessImage callback, index, err
    
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
                    errors : errors
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


