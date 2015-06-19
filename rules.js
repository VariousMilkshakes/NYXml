var NYXrules = {
    "set" : {
        "id" : 0,
        "autoClose" : false,
        "format" : {
            "txs"   : 14,
            "col"   : "#000",
            "bgc"   : "transparent",
            "aln"   : "left",
            "typ"   : "point"
        }
    },
    "pg" : {
        "id" : 1,
        "tag"   : "p",
        "content" : "",
        "autoClose" : true,
        "format" : {
            "txs" : "default",
            "col" : "default",
            "bgc" : "default"
        }
    },
    "h1" : {
        "id" : 2,
        "tag"   : "h1",
        "content" : "",
        "autoClose" : true,
        "format" : {
            "txs" : "default",
            "col" : "default",
            "bgc" : "default",
            "aln" : "default"
        }
    },
    "h2" : {
        "id" : 3,
        "tag"   : "h2",
        "content" : "",
        "autoClose" : true,
        "format" : {
            "txs" : "default",
            "col" : "default",
            "bgc" : "default",
            "aln" : "default"
        }
    },
    "h3" : {
        "id" : 4,
        "tag"   : "h3",
        "content" : "",
        "autoClose" : true,
        "format" : {
            "txs" : "default",
            "col" : "default",
            "bgc" : "default",
            "aln" : "default"
        }
    },
    "ig" : {
        "id" : 5,
        "tag" : "image",
        "content" : "",
        "autoClose" : true,
        "special" : "alt-text",
        "format" : {
            "src" : "default",
            "hgt" : "default",
            "wdt" : "default",
            "alt" : "default"
        }
    },
    "hr" : {
        "id" : 6,
        "tag" : "hr",
        "autoClose" : true,
        "special" : "percentageUnit",
        "format" : {
            "hgt" : "default",
            "wdt" : "default"
        }
    },
    "sl" : {
        "id" : 7,
        "tag" : "ul",
        "autoClose" : false,
        "special" : "start-list",
        "format" : {
            "typ" : "default"
        }
    },
    "le" : {
        "id" : 8,
        "tag" : "li",
        "autoClose" : true,
        "format" : {}
    },
    "el" : {
        "id" : 9,
        "tag" : {
            0: "ul",
            1: "li"
        },
        "autoClose" : false,
        "idLink" : "7",
        "special" : "link",
        "format" : {}
    }
};

exports.rules = function (){
    return NYXrules;
}

exports.set = function (loc, val){
    var indexie = loc.split(',');
    var rules = NYXrules;
    var log = [];
    console.log(indexie);

    for(each in indexie) {
        rules = rules[indexie[each]];
        log.push(rules);
    }

    log[log.length-1] = val;

    console.log(log);
    console.log(indexie);

    var i = log.length - 1;
    while (i >= 1) {
        var rebuild = log[i-1];
        rebuild[indexie[i]] = log[i];

        log[i-1] = rebuild;
        i--;
    }

    rules[indexie[0]] = rebuild;
    console.log(rules);
    return rules;
}
