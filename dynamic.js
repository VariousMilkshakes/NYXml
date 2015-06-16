module.exports = {
    "continous" : function (settings){
        var output = "";

        var i = currentLine;
        var line = lines[i];
        while (line[0] == '>') {
            output += line;

            i++;
            line = lines[i];
        }

        return output;
    },
    "alt-text" : function (){
    },
    "start-list" : function (){
    },
    "percentageUnit" : function (format){
        format.unit = "%";

        return format;
    }
};
