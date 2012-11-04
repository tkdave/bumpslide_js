define(['bumpslide/dispatcher', 'bumpslide/bindable', './mainView', 'simrou'], function (dispatcher, bindable, mainView, router) {


    var controller = _.extend(dispatcher(), {

        model: bindable({
            demo: undefined
        }),

        router: router({
            '/*demo': { get: gotoDemo }
        }),

        init: function () {

            // add main view
            $('#bumpslide-demo').append(mainView.el);

            // start router
            this.router.start("/");
        }

    });

    return controller;

    function gotoDemo(event, param) {
        controller.model.set('demo', param.demo || "welcome");
    }


})