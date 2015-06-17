var fs = require('fs');

var rules  = require('./rules.json');
var cssRef = require('./cssReference.json');
var dyn = require('./dynamic.js');

exports.scan = function(){
    fs.readFile("D:/HadeSoft/home_website/prototype/NYXml/tests/testFile2.txt", "utf8", function (err, data){
        var lines = data.split('\n');

        //Check if no rules have been used
        var plain = false;

        for (each in lines) {
            //Settings for this line

            var line = lines[each];
            //Ignore whitespaces
            if (!/\S/.test(line)) {
                console.log("SKIP LINE " + (+each + +1));
                continue;
            }

            //Check if line is plain text
            if (!/\>/.test(line)) {
                console.log("PLAIN LINE " + (+each + +1));

                if (plain) {
                    lines[each - 1]
                }
            }

            // element>element
            var elements = line.split('>');
            var control = elements[0].split(' ');

            var editor = control[0];
            var prefix = checkPrefix(editor);


            if (prefix != false) {
                editor = editor.substring(1);
            } else {
                prefix = "";
            }

            var settings = rules[editor];

            if (settings == undefined) {
                console.log("Editor: " + editor + " is not a recognised editor!");
                return false;
            }

            if (settings.content != undefined) {
                settings.content = elements[1];
            }

            if (line[0] == '>') {
                var content = line.substring(1);
                htmlOut += " " + content;
            }

            var setup = false;
            var i = 1;
            while (i < control.length) {
                var NYXrule = control[i].split('=');
                var option = NYXrule[0];
                var value  = NYXrule[1];

                if (settings[option] == undefined) {
                    console.log("Rule: " + editor + " is not a member of: " + control[0] + " - Line " + (+each + +1));
                    return false;
                } else {
                    console.log("e:" + editor);
                    if (editor == "set") {
                        console.log("setup");
                        rules.set[option] = value;
                        setup = true;
                    } else {
                        settings[option] = value;
                    }
                }

                i++;
            }

            if (settings.special != undefined) {
                settings = dyn[settings.special](settings, elements[1]);

                if (settings.autoClose == false) {
                    dynClose.push(settings.id);
                }

                if (!settings) {
                    return false;
                }
            }

            if (settings.idLink == dynClose[dynClose.length - 1]) {
                closeTags();
            } else {
                htmlConvert(prefix, settings, setup);
            }

            if (settings.autoClose) {
                closeTags();
            }
        }

        closeTags(true);
        console.log("OUT> " + htmlOut);
    });
}

var htmlOut = ""
var openTags = [];
var dynClose = [];
function htmlConvert (prefix, format, enclose){
    if (enclose) {
        htmlOut = "<div style='" + cssConvert(rules.set) + prefix + "'>";
        openTags.push("div");
    } else {
        var tag = format.tag;
        if (tag == undefined) tag = "div";

        htmlOut += "<" + tag + ">" + format.content;
        openTags.push("p");
    }
}

function cssConvert (format) {
    console.log(format);
    var props = Object.keys(format)

    var output = "";
    for (each in props) {
        var value = format[props[each]];
        var rule  = cssRef[props[each]];
        console.log(props[each]);
        console.log(rule);

        var css = rule.css + ":" + value + rule.unit + ";";

        output += css;
    }

    return output
}

function closeTags (all){
    var tagCount = openTags.length -1;

    if (all){
        var i = 0;

        while (i <= tagCount) {
            var pos = tagCount - i;
            var tag = openTags[pos];
            htmlOut += "</" + tag + ">";

            i++;
        }
    } else {
        var tag = openTags[tagCount];

        htmlOut += "</" + tag + ">";
    }
}

function checkPrefix (line){
    var prefix = line[0];

    switch (prefix) {
        case '_':
            return "text-decoration:underline;";
            break;
        case '^':
            return "font-weight:bold;";
            break;
        case '-':
            return "text-decoration:line-through;";
            break;
        case '/':
            return "font-style:italic;";
        default:
            return false;
    }
}
