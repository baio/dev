#http://net.tutsplus.com/tutorials/javascript-ajax/how-to-transition-an-image-from-bw-to-color-with-canvas/

$.fn.extend

  greyImages: () ->

        supportsCanvas = document.createElement('canvas').getContext;

        if supportsCanvas?
            throw "greyImages.browser doesn't support canvas"

            @each ->

                ctx = document.getElementsByTagName("canvas")[0].getContext '2d'
                img = document.getElementById("cvs-src")

                ctx.drawImage img, 0, 0

                # Set 500,500 to the width and height of your image.
                imageData = ctx.getImageData(0, 0, 500, 500);

                px = imageData.data;

                length = px.length;

                for i in [0..length-1] by  4
                    grey = px[i] * .3 + px[i+1] * .59 + px[i+2] * .11
                    px[i] = px[i+1] = px[i+2] = grey

                ctx.putImageData imageData, 0, 0