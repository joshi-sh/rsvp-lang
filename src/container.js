'use strict';
exports.container = (function(){
    //Objects that register react bocks
    var objects   = [];
    //Objects that register intercept blocks
    var trackers  = [];
    //Events raised in the middle of a react block are dispatched at the end
    var dispatchQ = [];
    var fire = function(e, os){
        os.
          //grab all objects interested in listening to this event
          filter(function(o){return o.e.name.test(e.name);}).
          //call the registered callback on the supplied this parameter
          forEach(function(o){o.cb.call(o.on, e);});
    };
    var ct = {
        //Register an object's react block
        addListener: function(a){
            objects.push({e: a.event, cb: a.callback, on: a.thisArg, id: a.id});
        },
        //Register an object's intercept block
        addIntercept: function(a){
            trackers.push({e: a.event, cb: a.callback, on: a.thisArg});
        },
        //Queue an event raised within a react block
        queueRaise: function(a){
            dispatchQ.push({raise: true, event: a});
        },
        //Queue an alert raised within a react block
        queueAlert: function(a){
            dispatchQ.push({event: a});
        },
        //Broadcast an event to all objects
        fireEvent: function(e){
            fire(e, trackers);
            fire(e, objects);
        },
        //Broadcast an event to selected objects
        sendMessage: function(a){
            fire(a.event, trackers);
            fire(a.event, objects.filter(function(o){return a.id.test(o.id);}));
        },
        //Asynchronously deliver events
        deliver: function(){
            while(x = dispatchQ.shift()){
                if(x.raise){
                    fireEvent(x.event);
                }else{
                    sendMessage(x.event);
                }
            });
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

