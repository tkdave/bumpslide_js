define(['underscore', 'bumpslide/view', 'bumpslide/getSet', 'text!./panel.html'], function (_, view, getSet, template) {

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