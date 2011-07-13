
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
          "drawing"
          "edge"
          "emboss"
          "enhance"
          "equalize"
          "flip"
          "flop"
          "gamma"
          "getters"
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
    null

viewModel = cltProcesses : ko.observableArray [new processVM("one"),  new processVM("two")]

ko.applyBindings viewModel

#--ko end
$ ->

    $("#img_process").click ->

        $("#img_src")[0].src = $("#img_url").val()

        cltParams = new Array()
        srvParams = ""

        for e in $("#params :checked")
            $e = $(e)
            if $e.next().attr("type") == "checkbox"
                cltParams.push
                      process : $e.parent().text()
                      params :  $e.parent().next().children(":input").val()

        for e in $("#params :checked")
            $e = $(e)
            if $e.next().attr("type") != "checkbox"
                srvParams += $e.parent().text()
                params = $e.parent().next().children(":input").val()
                if params
                    srvParams +=  "-" + params;

        $("#img_dest").imageProcessor "destroy"
        $("#img_dest").imageProcessor

                    server : "http://maxvm.goip.ru:8087"

                    src : $("#img_url").val()

                    process : srvParams

                    animateCss : "img-prr-animated"

                    success : (img) ->

                        for p in cltParams

                            himg = $(img).pixastic p.process, p.params

                        himg
