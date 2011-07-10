$ ->
    $("#img_process").click ->

        $("#img_src")[0].src = $("#img_url").val()

        cltParams = new Array()
        srvParams = null

        for e in $("#params :checked")
            $e = $(e)
            if $e.next().attr("type") == "checkbox"
                cltParams.push
                      process : $e.prev().text()
                      params :  $e.next(":input[type='text']").value()

        for e in $("#params :checked")
            $e = $(e)
            if $e.next().attr("type") != "checkbox"
                srvParams += e.prev().text()
                params = $e.next(":input[type='text']").value()
                if params
                    srvParams +=  "-" + params

        $("#img_dest").imageProcessor

                    server : "http://maxvm.goip.ru:8087"

                    src : $("#img_url").val()

                    process : srvParams

                    animateCss : "img-prr-animated"

                    success : (img) ->

                        for p of cltParams

                            $(img).pixastic p.process, p.params
