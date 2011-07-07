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

    @fitSize: (origSize) ->
        colNums = Math.floor origSize.width / 80
        colNums = 1 if colNums == 0
        colNums = 12  if colNums > 12
        @getSize origSize, colNums

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
        if pr then pr.split(";").length else 0
                            
    proccess: ->
        r uri : @options.settings.url, encoding : "binary", httpModule : true,  (error, response, body) => 
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
                                            
    processImage: (callback, index) ->
        
        #if first opertaion in stack 
        index ?= @getProcessorsCnt() - 1
                    
        prr = @getProcessor index
                    
        switch prr.name
            when "resize"  
                    @resize prr.prms, callback, index
            else 
                @endProcessImage callback, index, "process #{prr.name} not found"
                
    endProcessImage: (callback, index, error) ->    
        if !error 
            console.log "Image proccess setp #{index} success"
        else
            console.log "Image proccess setp #{index} fails:\n#{error}"
        
        if index == 0
            callback()
        else        
            @processImage callback, index--

    
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


