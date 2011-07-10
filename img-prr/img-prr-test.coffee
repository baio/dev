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
                    srvParams +=  "-" + params

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
