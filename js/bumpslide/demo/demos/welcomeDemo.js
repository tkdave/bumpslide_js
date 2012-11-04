define(['bumpslide/view', 'text!templates/welcome.html'], function(view, template) {

    return function () {

        var self = _.extend( view(), {
            name: 'welcome',
            template: template
        });

        return self;


    }


})
