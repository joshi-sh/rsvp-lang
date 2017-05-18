(function(ct){
    var timer = {};
    ct.addListener({
        event    : {name: new RegExp("Timer::Set")},
        callback : function(e){
                       setTimeout(()=>ct.queueRaise({name: "Timer::Fired", id: e.timerID}), e.delay);
                   },
        thisArg  : timer,
        id       : "Timer"
    });
}(container));