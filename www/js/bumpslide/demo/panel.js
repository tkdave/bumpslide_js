define(['underscore', 'bumpslide/view', 'text!./panel.html'], function (_, view, template) {

    return function (title, content) {

        var self = view.extend({
            templateProps: { title: title },
            template: template,
            onInit: init
        });

        function init() {
            $('.content', this.el).append( content );
        }

        return self;

    };
});