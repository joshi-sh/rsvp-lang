/* eslint no-unused-vars: 0 */
'use strict';
let __container = (function () {
    let objects   = [], // Objects that register react bocks
        trackers  = [], // Objects that register intercept blocks
        dispatchQ = [], // Events raised in the middle of a react block are dispatched at the end
        fire = function (event, objects) {
            objects.
                //grab all objects interested in listening to this event
                filter(function (object) {return object.event.name.test(event.name); }).
                //call the registered callback on the supplied this parameter
                forEach(function (object) {object.callback.call(object.thisArg, event); });
        };
    return {
        //Register an object's react block
        addListener: function (listener/* = {event, callback, thisArg, id}*/) {
            objects.push(listener);
        },
        //Register an object's intercept block
        addIntercept: function (intercept/* = {event, callback, thisArg}*/) {
            trackers.push(intercept);
        },
        //Queue an event raised within a react block
        queueRaise: function (message) {
            dispatchQ.push({raise: true, event: message});
            if(dispatchQ.length === 1) {
                this.deliver();
            }
        },
        //Queue an alert raised within a react block
        queueAlert: function (message) {
            dispatchQ.push({event: message});
            if(dispatchQ.length === 1) {
                this.deliver();
            }
        },
        //Broadcast an event to all objects
        fireEvent: function (event) {
            fire(event, trackers);
            fire(event, objects);
        },
        //Broadcast an event to selected objects
        sendMessage: function (message) {
            fire(message.event, trackers);
            fire(message.event, objects.filter(function (object) {return message.id.test(object.id); }));
        },
        //Asynchronously deliver events
        deliver: function () {
            let x = dispatchQ.shift();
            while(x !== undefined) {
                if(x.raise) {
                    this.fireEvent(x.event);
                }else{
                    this.sendMessage(x.event);
                }
                x = dispatchQ.shift();
            }
        }
    };
}());

