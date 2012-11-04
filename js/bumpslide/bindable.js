define(['underscore', './loggable'], function (_, loggable) {

    /**
     * bumpslide.bindable
     * ==================
     *
     * This is an observable hash map that uses callbacks to notify of state changes.
     *
     * Example
     * `
     *   var model = bindable({ section: 0, pageNumber: 0} );
     *   var binding = model.bind('section', onSectionChange );
     *   function onSectionChange( section ) {
     *     console.log('section is now', section);
     *   }
     *   model.set('section', 1);
     *   model.unbind('section', binding);
     * `
     *
     * @author David Knape, http://bumpslide.com/
     */
    return function (props) {

        var self = _.extend(loggable(), {

            // bindable attributes (an object)
            props: props || {},

            bindings: {},

            logEnabled: false,
            logPrefix: '{bindable}',

            // get a named property from the hash map
            // optionally, provide a default val that will be returned if the property is undefined
            get: function (prop, default_val) {
                var val = this.props[prop];
                return (val === undefined) ? default_val : val;
            },

            // set a named property on the hash map (props)
            // you can optionally pass in an object as the first param
            // and properties will be merged one at a time
            set: function (prop, new_val) {
                this.log('set', prop, '=', new_val);
                // handle object props
                if (typeof prop == 'object') {
                    for (var p in prop) this.set(p, prop[p]);
                    return;
                }
                var old_val = this.props[prop];
                if (!_.isEqual(old_val, new_val)) {
                    this.props[prop] = new_val;
                    this.notifyChanged(prop, old_val, new_val);
                }
            },

            // listen for property change events
            bind: function (prop, changeHandler, updateNow /* false */) {
                // create bindings map and prop-specific child array if it doesn't already exist
                this.bindings = this.bindings || {};
                this.bindings[ prop ] = this.bindings[ prop ] || [];

                // add the new change handler to this list
                this.bindings[ prop ].push(changeHandler);

                // If the updateNow flag is set, apply the binding right now
                if (updateNow === true) changeHandler.apply(null, [ this.props[prop], undefined ]);

                // return the function so we can do things like this...
                //
                //   var onChange = model.bind( 'sectionIndex', function(old_val, new_val) { });
                //   model.unbind( onChange );
                //
                return changeHandler;
            },

            // unbind a change handler
            // If no handler is specified, all handlers for that prop are removed
            unbind: function (prop, changeHandler /* opt */) {
                if (changeHandler === undefined) {
                    // remove all bindings for this property
                    this.bindings[prop] = [];
                    return;
                }
                var handlers = this.bindings[prop];
                var idx = _.indexOf(handlers, changeHandler);
                if (idx !== -1) handlers.splice(idx, 1);
            },

            // remove all bindings
            unbindAll: function () {
                this.bindings = {}
            },


            notifyChanged: function (prop, old_val, new_val) {
                this.log('prop_change', prop, new_val);
                var callbacks = [];
                if (this.bindings[prop] !== undefined) callbacks = callbacks.concat(this.bindings[prop]);
                if (this.bindings['*'] !== undefined) callbacks = callbacks.concat(this.bindings['*']);
                _.each(callbacks, function (cb) {
                    cb.call(null, new_val, old_val);
                });
            },

            notify: function (type, data) {
                _.each(this.bindings[type], function (cb) {
                    cb.call(null, data);
                });
            }
        });

        return self;
    };
});