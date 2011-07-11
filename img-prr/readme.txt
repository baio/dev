The idea from here : 
http://www.maxnov.com/getimagedata

ImageProcessor (Server)

Implementation with node.js + coffee
Retrieve image data from server in string64 format plus can proccess requested images.
The list of process opertaions bellow.

The common format of requested process:
name_of_process[-params];

The consequent porcesses must be separated with ";"

The processes and parameters could be seen here
http://www.graphicsmagick.org/Magick++/Image.html#manipulate-an-image
https://github.com/aheckmann/gm/tree/master/examples

========================================================
1.resize
?resize-{width}[,{height}][,{format}]

---

params:

widht, height, format

if height not defined then height = width

format - % | px (default) | 960gs

- for px size in pixels
- for % percentage of zooming
- for 960gs width in columns (1..12) see www.960.gs, 
    the heigth changes proportinally to the width
    also has special size "fit" in this case size of image wil be fitted to the most
    suitable for 960 grid (considering to room the whole columns).

---

examples : 
?resize-100,200,px
?resize-100,px
?resize-100,px
?resize-50,70,%
?resize-3,960gs
?resize-fit,960gs

******************************************

ImageProcessor (Client)
