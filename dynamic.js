module.exports = {
    "alt-text" : function (format, content){
        format[alt] = content;

        return format;
    },
    "start-list" : function (format, content){
        var type = format.typ;
        var tag = "";

        switch (type){
            case "num":
                tag = "ol";
                break;
            case "point":
                tag = "ul";
                break;
            default:
                tag = "ul";
                break;
        }

        format.tag = tag;
        return format;
    },
    "percentageUnit" : function (format, content){
        format.unit = "%";

        return format;
    }
};
