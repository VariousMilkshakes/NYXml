var fs = require('fs');

var rules = require('./rules.json');

exports.convert = function(){
    fs.readFile("D:/HadeSoft/home_website/prototype/NYXml/tests/testFile1.txt", "utf8", function (err, data){
        var lines = data.split('\n');
        for (each in lines) {
            var line = lines[each];
            var elements = line.split('>');

            var rule = rules[elements[0]];
            var o
        }
    });
}
