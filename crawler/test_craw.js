var Crawler = require("crawler").Crawler;

var c = new Crawler({
    "maxConnections":10,
    "timeout":60,
    "debug":true,
    "callback":function(error,result,$) {
        console.log("Got page");
        //console.log($('body').text());
        
        $("a").each(function(i,a) {
            console.log(a.href);
            //c.queue(a.href);
        })
    }
});

c.queue(["http://navalny.livejournal.com/611559.html"]);
