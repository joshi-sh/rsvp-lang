//Standard transforms that are available to any RSVP script
//math#foo(x) is the same as Math.foo(x)

var math = {
    transform: function(message, ...args){
        return Math[message] && Math[message].apply(undefined, args);
    }
};
