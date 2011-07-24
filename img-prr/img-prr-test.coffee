
#create menu
client_processes = [
    {name : "Blend", disabled : true}
    {name : "Blur"}
    {name : "BlurFast", def : {amount:0.5}}
    {name : "Brightness", def : {brightness:50,contrast:0.5}}
    {name : "ColorAdjust", def : {red:0.5,green:0,blue:0}}
    {name : "ColorHistogram", disabled : true}
    {name : "Crop", def : { rect : {left : 50, top : 50, width : 50, height : 50} }}
    {name : "Desaturate", def : {average : false}}
    {name : "EdgeDetection", def : {mono:true, invert:false}}
    {name : "EdgeDetection2"}
    {name : "Emboss", def : {greyLevel:100,direction:"topright"}}
    {name : "FlipH"}
    {name : "FlipV"}
    {name : "Glow", def : {amount:0.5,radius:1.0}}
    {name : "Histogram", disabled : true}
    {name : "Hue", def : {hue:30,saturation:20,lightness:0}}
    {name : "Invert"}
    {name : "Laplace", def : {edgeStrength:0.5,invert:false,greyLevel:0}}
    {name : "Lighten", def : {amount:0.5}}
    {name : "Mosaic", def : {blockSize:10}}
    {name : "Noise", def : {mono:true,amount:0.5,strength:0.5}}
    {name : "Pointillize", disabled :  true}
    {name : "Posterize", def : {levels:10}}
    {name : "RemoveNoise"}
    {name : "Sepia"}
    {name : "Sharpen", def : { amount : 0.5 }}
    {name : "Solarize"}
    {name : "UnsharpMask", def : {amount:0.5, radius:1, treshold:100}}
]

server_processes = [
          "bitdepth"
          "blur"
          name : "changeFormat", disabled : true
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
          name : "morph", disabled : true
          "negative"
          "new"
          "noise1"
          "noise2"
          "paint"
          "quality"
          "raise"
          "region"
          "resample"
          "resize"
          "roll"
          "rotate"
          "scale"
          "sepia"
          "sharpen"
          "solarize"
          "spread"
          "swirl"
          name : "thumb", disabled : true
      ]


#--ko initialization
processVM = (obj) ->
    @name = if obj.name then obj.name else obj
    @def = if obj.def then JSON.stringify(obj.def) else null
    @enabled = if obj.disabled then !obj.disabled else true
    @checked = ko.observable false
    @params = ko.observable null
    #you must return null here instead row above will be returned and knockout initialization silently fails
    null

viewModel =
    cltProcesses : ko.observableArray $.map(client_processes, (p) -> new processVM p)
    srvProcesses : ko.observableArray $.map(server_processes, (p) -> new processVM p)

ko.applyBindings viewModel

#--ko end
$ ->

    $("#img_process").click ->

        $("#img_src")[0].src = $("#img_url").val()

        cltParams = new Array()
        srvParams = ""

        for e in $("#options_clt :checked")
            $e = $(e)
            cltParams.push
                  process : $.trim $e.next().text().toLowerCase()
                  params :  $.trim $e.next().next().val()

        for e in $("#options_srv :checked")
            $e = $(e)
            srvParams += $.trim $e.next().text()
            params = $.trim $e.next().next().val()
            if params
                srvParams +=  "-" + params
            srvParams +=";"

        $("#img_dest").imageProcessor "destroy"
        $("#img_dest").imageProcessor

                    server : "http://maxvm.goip.ru:8087"

                    src : $("#img_url").val()

                    process : srvParams

                    animateCss : "img-prr-animated" if $("#animate_img").attr "checked"

                    success : (img, errors) ->

                        himg = $ img

                        for p in cltParams

                            himg = himg.pixastic p.process, if p.params then eval('(' + p.params + ')') else null
                            
                        $("#prc_errors").text ""
                        $("#prc_errors").text errors.join "---\n"
                            
                        himg
                        