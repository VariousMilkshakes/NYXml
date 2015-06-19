var fs = require('fs');

var nyx  = require('./rules.js');
var cssRef = require('./cssReference.json');
var dyn = require('./dynamic.js');

exports.scan = function(inBox){
    if (inBox == undefined) inBox = false;
    masterBox = inBox;
    fs.readFile("D:/HadeSoft/home_website/prototype/NYXml/tests/testFile2.txt", "utf8", function (err, data){
        var lines = data.split('\n');
        var rules = nyx.rules();

        //Check if no rules have been used
        var plain = false;

        for (each in lines) {
            var line = lines[each];

            var prefix = checkPrefix(line[0]);
            if (prefix != false) {
                line = line.substring(1);
            } else {
                prefix = "";
            }

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
            var controls = elements[0].split(' ');

            var editor = controls[0];

            var settings = rules[editor];
            console.log(nesting);

            if (prefix == true) {
                console.log("nest");
                nestElement(settings.tag);
            } else if (nesting) {
                nesting = false;
                console.log("End nest: ");
                console.log(openTags);
                closeTags();
            }

            if (settings == undefined) {
                console.log("Editor: " + editor + " is not a recognised editor!");
                return false;
            }

            if (settings.content != undefined) {
                settings.content = elements[1];
            } else {
                settings.content = "";
            }

            if (line[0] == '>') {
                var content = line.substring(1);
                htmlOut += " " + content;
            }

            var setup = false;
            var write = true;

            var i = 1;
            while (i < controls.length) {
                var NYXrule = controls[i].split('=');
                var option = NYXrule[0];
                var value  = NYXrule[1];

                if (settings.format[option] == undefined) {
                    console.log("Rule: " + option + " is not a member of: " + editor + " - Line " + (+each + +1));
                    return false;
                } else {
                    console.log("e:" + editor);
                    if (editor == "set") {
                        console.log("setup " + option + " as " + value);
                        nyx.set("set,format," + option, value);
                        console.log(rules.set);
                        settings = rules.set;
                        console.log(settings);
                        setup = true;
                        write = inBox;
                    } else {
                        settings.format[option] = value;
                    }
                }

                i++;
            }

            if (settings.special != undefined) {
                console.log(settings.special);
                if (settings.special == "link") {
                    console.log(dynClose);
                    console.log(settings.idLink);
                    if (settings.idLink == dynClose[dynClose.length - 1]) {
                        console.log("Closing tag");
                        dynClose = dynClose.splice(dynClose.length - 1, 1);
                        write = false;
                    } else {
                        write = true;
                    }
                } else {
                    console.log("tracl");
                    var dynamic = dyn[settings.special];
                    settings = dynamic(settings, elements[1]);

                    if (settings.autoClose == false) {
                        dynClose.push(settings.id);
                    }

                    if (!settings) {
                        return false;
                    }
                }
            }

            if (write) {
                console.log("HTML");
                htmlConvert(prefix, settings, rules, setup);
                console.log(htmlOut);
            }

            if (settings.autoClose) {
                console.log("Tags");
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
var prevTag = "";
var nesting = false;
var masterBox = false;

function htmlConvert (prefix, format, global, enclose){
    if (enclose) {
        console.log("Enclosing HTML");
        htmlOut = "<div style='" + cssConvert(nyx.rules().set) + prefix + "'>";
        openTags.push("div");
    } else {
        var tag = format.tag;
        if (tag == undefined) tag = "div";

        var formatting = cssConvert(format, global);
        if (formatting == "") {
            var style = "";
        } else {
            style = " style='" + formatting + "'";
        }

        htmlOut += "<" + tag + style + ">" + format.content;
        openTags.push(tag);
    }
}

function cssConvert (format, global) {
    var output = "";
    for (each in format.format) {
        var value = format.format[each];
        console.log(each);

        if (value == "default" && !masterBox) {
            value = global.set.format[each];
        } else if (value == "default" && masterBox) {
            continue;
        }

        var rule  = cssRef[each];


        var css = rule.css + ":" + value + rule.unit + ";";

        output += css;
    }

    return output
}

function closeTags (all){
    var tagCount = openTags.length -1;
    console.log(openTags);

    if (all){
        var i = 0;

        while (i <= tagCount) {
            console.log("?");
            var pos = tagCount - i;
            var tag = openTags[pos];
            var close = "</" + tag + ">";
            htmlOut += close;
            prevTag = close;

            i++;
        }

        openTags = [];
    } else {
        var tag = openTags[tagCount];
        openTags.splice(-1, 1);
        console.log(openTags);

        var close = "</" + tag + ">";
        htmlOut += close;
        prevTag = close;
    }
}

function checkPrefix (prefix){
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
            break;
        case '>':
            return true;
            break;
        default:
            return false;
    }
}

function nestElement (currentTag){
    console.log("nest");
    nesting = true;
    var outLength = htmlOut.length - 1;
    var finalTagLength = prevTag.length - 1;
    htmlOut = htmlOut.substring(0, outLength - finalTagLength);

    var parentTag = prevTag.substring(2, finalTagLength);
    console.log(parentTag);

    openTags.push(parentTag);
    console.log("VVVVVV");
    console.log(openTags);
}
