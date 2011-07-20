
#create menu
client_processes = [
    "Blend"
    "Blur"
    "BlurFast"
    "Brightness"
    "ColorAdjust"
    "ColorHistogram"
    "Crop"
    "Desaturate"
    "EdgeDetection"
    "EdgeDetection2"
    "Emboss"
    "Flip"
    "Horizontally"
    "FlipVertically"
    "Glow"
    "Histogram"
    "Hue"
    "Saturation"
    "Lightness"
    "Invert"
    "LaplaceEdgeDetection"
    "Lighten"
    "Mosaic"
    "Noise"
    "Pointillize"
    "Posterize"
    "RemoveNoise"
    "Sepia"
    "Sharpen"
    "Solarize"
    "Unsharp"
    "Mask"
]

server_processes = [
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
          "thumb"
      ]

#--ko initialization
processVM = (name) ->
    @name = name
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
                  process : $e.next().text()
                  params :  $e.next().next().val()

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

                    animateCss : "img-prr-animated"

                    success : (img, errors) ->

                        for p in cltParams

                            himg = $(img).pixastic p.process, p.params
                            
                        $("#prc_errors").text ""
                        $("#prc_errors").text errors.join "---\n"
                            
                        himg
                        