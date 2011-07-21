var http = require('http')
var fs = require('fs')

var options = {
  host: 'www.google.com',
  port: 80,
  path: '/images/logos/ps_logo2.png'
}

var request = http.get(options, function(res){
  res.setEncoding('binary')
  var imagedata = ''
  res.on('data', function (chunk) {
    imagedata += chunk; 
  })
  res.on('end', function(){
    fs.writeFile('logo.png', imagedata, 'binary', function (err) {
      if (err) throw err
        console.log('It\'s saved!');
    })
  })
})