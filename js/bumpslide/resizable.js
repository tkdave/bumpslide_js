/**
 * This module defines a reusable "resizable" interface
 *
 * Something like this...
 * _.extend( self, resizable() );
 *
 * @author David Knape, http://bumpslide.com/
 */
define(['underscore', 'bumpslide/bindable', 'bumpslide/dispatcher'], function (_, bindable, dispatcher) {

    return function () {

        var self = _.extend( dispatcher(), {

            size: bindable({width:0, height:0}),

            initResizeBinding: function () {
                this.size.bind('*', onResize );
            },

            destroyResizeBinding: function () {
                this.size.unbindAll();
            },

            setSize: function (w,h) {
                this.size.set('width', w);
                this.size.set('height', h);
            }

        });

        // on resize, dispatch a resize event with height and width
        var onResize = _.debounce( 10, function () {
            self.trigger('resize', self.size.props );
        });

        self.initResizeBinding();

        return self;

    }


});