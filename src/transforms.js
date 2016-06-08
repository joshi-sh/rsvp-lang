//Standard transforms that are available to any RSVP script
//x >>| math#foo is the same as Math.pow(x)

var math = {
    transform: function(message, ...args){
        return Math[message] && Math[message].apply(undefined, args);
    }
};
