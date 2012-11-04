define(['underscore'], function (_) {

    /**
     *  bumpslide.loggable
     *  ==================
     *
     *  Returns object with a log function that proxies to console.log whenever logEnabled is true.
     *  Logging implementation is configurable and default to console.log.
     *  An empty console.log shim is included.
     *
     *  @author David Knape, http://bumpslide.com/
     */

    var loggable = function (log_enabled) {

        var self = {

            logPrefix: undefined,

            logEnabled: log_enabled || false,

            logFunctionScope: console || {},

            logFunction: console.log || function(){},

            log: function () {
                var args =  _.toArray(arguments);
                if(this.logPrefix!==undefined) args.unshift(_.isFunction(this.logPrefix) ? this.logPrefix() : this.logPrefix);
                if (this.logEnabled) this.logFunction.apply(this.logFunctionScope, args);
            }

        };

        return self;
    };

    return loggable;
});