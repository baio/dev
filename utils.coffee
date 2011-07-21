String::da_trim = (str, start)->
    
    str ?= "\s"
    
    a = @

    if (start == true || not start?)
        r = new RegExp "^#{str}+"
        a = a.replace r, ""
        
    if (start == false || not start?)
        r = new RegExp "#{str}+$"
        a = a.replace r, ""
    
    a.toString();
    
Array::da_joinUrls = (joiner)->
    
    s = @[0]?.da_trim '/', false
    for i in @.slice 1
        if i then s += '/' + i.da_trim '/', true
    s
    
s = "zztest/".da_trim "/", true

s = ["x", null].da_joinUrls('/')

console.log(s);