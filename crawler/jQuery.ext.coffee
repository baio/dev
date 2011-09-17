jQuery::textNodes = (node) ->
    node.contents().filter -> @nodeType == 3
    

###

http://stackoverflow.com/questions/950331/jquery-next-siblings
jQuery.fn.nextUntil = function(selector)
{
    var query = jQuery([]);
    while( true )
    {
        var next = this.next();
        if( next.length == 0 || next.is(selector) )
        {
            return query;
        }
        query.add(next);
    }
    return query;
}

http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
$(elem)
  .contents()
  .filter(function() {
    return this.nodeType == Node.TEXT_NODE;
  });
  
$(".statya").children(2).children(2).children(1).children(1).contents().filter(function(){return this.nodeType == 3;}).text()

$.trim($(".statya h2 ~ p:not([class])").text())
###
