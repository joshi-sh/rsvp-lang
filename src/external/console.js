(function(ct){
    var lg2console = {};
    ["Log", "Error", "Warn"].forEach(function(f){
        ct.addListener({
            event    : {name: new RegExp("Console::" + f)},
            callback : function(e){
                           console[f.toLowerCase()].
                             apply(console, [e.data].concat(e.args||[]));
                       },
            thisArg  : lg2console,
            id       : "lg2console"
        });
    });
}(container));
