// event dispatcher
// requires jquery or zepto

define([], function () {

    var dispatcher = function () {

        return {

            logEnabled:true,

            _dispatcher:$({}),

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

    // Add
    dispatcher.init = function ( obj ) {
        _.extend( obj, dispatcher() );
    };

    return dispatcher;
})