

$(document).ready(function(){
        textElements = function(node)
        {
             return $(node).contents().filter(function() {
                return $(this).text() && (this.nodeType == 3 || this.nodeName == "A");
            });
        }

        var s = $.trim(textElements($(".statya").children(2).children(2).children(1).children(1)).text()) + "\n\n" +
                $.trim($(".statya h2 ~ p:not([class])").text());
        s = $.trim(s);
        s = s.replace(/\n+/gm,"\n");
        console.log(s);
    });