'use strict';
exports.container = (function(){
    var objects    = [];
    var trackers   = [];
    var fire = function(e, os){
        os.
          //grab all objects interested in listening to this event
          filter(function(o){return o.e.name.test(e.name);}).
          //call the registered callback on the supplied this parameter
          forEach(function(o){o.cb.call(o.on, e);});
    };
    var ct = {
      addListener: function(a){
        objects.push({e: a.event, cb: a.callback, on: a.thisArg, id: a.id});
      },
      addIntercept: function(a){
        trackers.push({e: a.event, cb: a.callback, on: a.thisArg});
      },
      fireEvent: function(e){
        fire(e, trackers);
        fire(e, objects);
      },
      sendMessage: function(a){]
          fire(a.event, trackers);
          fire(a.event, objects.filter(function(o){return a.id.test(o.id);}));
      }
    };
    //
    //Set up standard events the container knows to deal with
    //

    //
    //Console events
    //
    var lg2console = {};
    ["Log", "Error", "Warn"].forEach(function(f){
        ct.addListener({
            event : "Console::" + f,
            cb    : function(e){
                        console[f.toLowerCase()].
                              apply(console, [e.data].concat(e.args||[]));
                    },
            on    : lg2console,
            id    : "lg2console"
        });
    });
    return ct;
})();

