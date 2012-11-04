/**
 *  Event dispatcher functionality.
 *
 *  This is very similar to Backbone events in that it can be used to add
 *  event dispatcher functions to any object.
 *
 *  Under the hood, we are using jquery to provide the event model abstraction layer.
 *
 *  Example:
 *
 *  // apply dispatcher properties to arbitrary object:
 *  var obj = {};
 *  _.extend(obj, dispatcher());
 *  obj.bind('hello', function(evt, name) { console.log('Hello, '+name); } );
 *  obj.trigger('hello');
 *
 *  @author David Knape, http://bumpslide.com.
 */

define(['underscore', 'jquery'], function (_, $) {

    return function (target, name) {

        // target is the event target
        // by default, this is an anonymous object,
        // use case for this is when you want a view component
        // to proxy events for it's underlying DOM element

        if (target == undefined) target = {};
        if (name == undefined) name = 'Dispatcher';

        return {

            logEnabled: true,

            _dispatcher: $(target),

            // add event listener
            bind: function (event_type, handler) {
                $.fn.bind.apply(this._dispatcher, arguments);
            },

            // remove event listener
            unbind: function (event_type, handler) {
                $.fn.unbind.apply(this._dispatcher, arguments);
            },

            // trigger event
            trigger: function () {
                $.fn.triggerHandler.apply(this._dispatcher, arguments);
            }

        };
    };
});