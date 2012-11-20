define(['bumpslide/dispatcher', './state', './mainView', 'simrou'], function (dispatcher, state, mainView, router) {

    state.logEnabled = true;

    // application controller
    var self = _.extend(dispatcher(), {

        // application router
        router: router({
            '/*section': { get: gotoSection }
        }),

        mainView: mainView,

        init: function () {


            mainView.init();

            // add main view
            $('#bumpslide-demo').append(mainView.el);

            // start router
            this.router.start("/welcome");

            mainView.show();


        }

    });

    function gotoSection(event, param) {

        state.set('section', param.section || "welcome");
    }

    return self;


})