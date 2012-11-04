define(['underscore', 'jquery', './dispatcher', './loggable'], function (_, $, dispatcher, loggable) {

    /**
     *  View templating, events, and render methods.
     *
     *  @author David Knape, http://bumpslide.com/
     */
    return function () {

        // abstract base view
        var self = _.extend( loggable(), dispatcher(), {

            name: 'view',
            visible: false,

            // template and properties
            template: '<div></div>',
            templateData: {},

            // jquery shortcut scoped ot the current element
            $: function() { this.el.query.apply(this.el, _.toArray(arguments));},

            toString: function () {
                return '[views/' + this.name + '] ';
            },

            init: function (onCreationComplete) {

                this.onCreationComplete = onCreationComplete;


                // If element already exists, use it, but make sure it's jqueried
                if (this.el != null) {
                    this.el = $(this.el);
                } else {
                    if (!this.template) {
                        this.template = '<div>';
                    }
                    try {
                        //console.log(this + 'init()');
                        var html = _.template(this.template, this.templateData);
                        self.el = $(html);
                    } catch (e) {
                        //console.log( 'Error processing template.', this.templateProps );
                    }
                    if (this.el == null) {
                        this.el = $('<div class="templateError">Error loading template for view "' + this.name + '"</div>');
                    }
                }

                // hide to start
                this.el.stop(true, true).hide();

                // add bind/unbind/trigger methods that are fronts for similar jquery methods on the main view element
                _.extend(this, dispatcher(this.el));

                if (this.onInit) this.onInit.call(this);
                if (this.onCreationComplete) this.onCreationComplete(this);
                return this;
            },

            // re-render
            draw: function() {
                this.el.html( this._template( this.templateData ) );
            },

            show: function (onTransitionComplete) {
                if (this.visible) return false;

                // initialize if we haven't already (no longer a need to call init explicitly)
                if (this.el == null) this.init();

                this.visible = true;
                //console.log(this + 'show()');
                if (this.onShow) this.onShow();
                if (this.transitionIn) {
                    this.transitionIn(onTransitionComplete);
                } else {
                    this.el.stop(true, true).show();
                    if (onTransitionComplete) onTransitionComplete();
                }
            },

            hide: function (onTransitionComplete) {
                if (!this.visible) return false;
                this.visible = false;
                //console.log(this + 'hide()');
                if (this.onHide) this.onHide();
                if (this.transitionOut) {
                    this.transitionOut(onTransitionComplete);
                } else {
                    this.el.stop(true, true).hide();
                    if (onTransitionComplete) onTransitionComplete();
                }
            },

            destroy: function () {
                if (this.onDestroy) this.onDestroy.call(this);
                this.el.empty();
            }



        };

        return view;
    }
});