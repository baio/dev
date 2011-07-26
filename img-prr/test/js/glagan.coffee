$ ->
  $(".animated").imageProcessor

            server : "http://maxvm.goip.ru:8087"

            animateCss : "img-prr-animated"

            success : (img, errors) ->

                himg = $ img

                himg = himg.pixastic "desaturate"

                himg = himg.pixastic "blur"

                himg