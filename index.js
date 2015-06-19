var fs = require('fs');
var q = require('q');

var nyx  = require('./rules.js');
var cssRef = require('./cssReference.json');
var dyn = require('./dynamic.js');

exports.scan = function (enclose){
    var defer = q.defer();
    fs.readFile("D:/HadeSoft/home_website/prototype/NYXml/tests/testFile2.txt", "utf8", function (err, data){
        if (err) {
            defer.reject(new Error(error));
        } else {
            defer = parseNyx(data, enclose, defer);
        }
    });
    return defer.promise;
}

exports.toHtml = function(data, enclose) {
    var defer = q.defer();
    defer = parseNyx(data, enclose, defer);
    return defer.promise;
}

var htmlOut = ""
var openTags = [];
var dynClose = [];
var prevTag = "";
var nesting = false;
var masterBox = false;

function htmlConvert (prefix, format, global, enclose){
    if (enclose) {

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


    if (all){
        var i = 0;

        while (i <= tagCount) {

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

    nesting = true;
    var outLength = htmlOut.length - 1;
    var finalTagLength = prevTag.length - 1;
    htmlOut = htmlOut.substring(0, outLength - finalTagLength);

    var parentTag = prevTag.substring(2, finalTagLength);


    openTags.push(parentTag);


}

function parseNyx (data, inBox, defer){
    if (inBox == undefined) inBox = false;
    masterBox = inBox;
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
            continue;
        }

        //Check if line is plain text
        if (!/\>/.test(line)) {
            // if (plain) {
            //     lines[each - 1];
            // }
            continue;
        }

        // element>element
        var elements = line.split('>');
        var controls = elements[0].split(' ');

        var editor = controls[0];

        var settings = rules[editor];


        if (prefix == true) {
            nestElement(settings.tag);
        } else if (nesting) {
            nesting = false;
            closeTags();
        }

        if (settings == undefined) {
            defer.reject(new Error("Editor: " + editor + " is not a recognised editor! - Line " + (+each + +1)));
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
                defer.reject(new Error("Rule: " + option + " is not a member of: " + editor + " - Line " + (+each + +1)))
            } else {

                if (editor == "set") {

                    nyx.set("set,format," + option, value);

                    settings = rules.set;

                    setup = true;
                    write = inBox;
                } else {
                    settings.format[option] = value;
                }
            }

            i++;
        }

        if (settings.special != undefined) {

            if (settings.special == "link") {


                if (settings.idLink == dynClose[dynClose.length - 1]) {

                    dynClose = dynClose.splice(dynClose.length - 1, 1);
                    write = false;
                } else {
                    write = true;
                }
            } else {

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

            htmlConvert(prefix, settings, rules, setup);

        }

        if (settings.autoClose) {

            closeTags();
        }
    }

    closeTags(true);
    defer.resolve(htmlOut);

    return defer;
}
