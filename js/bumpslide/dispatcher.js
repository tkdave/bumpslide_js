// event dispatcher
// requires jquery or zepto

// Example applying dispatcher properties to arbitrary object:
//   var obj = {};
//   _.extend(obj, dispatcher());
//   obj.bind('hello', function(evt, name) { console.log('Hello, '+name); } );
//   obj.trigger('hello', 'world');

define(['jquery', 'underscore'], function ($, _) {

    return function ( target ) {

        // target is the event target
        // by default, this is an anonymous object,
        // use case for this is when you want a view component
        // to proxy events for it's underlying DOM element

        if(target==undefined) target={};

        return {

            logEnabled:true,

            _dispatcher:$(target),

            bind:function (event_type, handler) {
                $.fn.bind.apply(this._dispatcher, arguments);
            },

            unbind:function (event_type, handler) {
                $.fn.unbind.apply(this._dispatcher, arguments);
            },

            trigger:function () {
                if (this.logEnabled) console.log('[Dispatcher] trigger event:', arguments);
                $.fn.triggerHandler.apply(this._dispatcher, arguments);
            }
        };

    };
});