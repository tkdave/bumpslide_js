define(['bumpslide/view', 'text!templates/welcome.html'],
    function (view, template) {

        /**
         * The welcome view is just an HTML Template
         *
         * see <a href="templates/welcome.html">templates/welcome.html</a>
         *
         * Templates are processed using underscore's _.template method.
         */
        return function () {

            return _.extend(view(), {
                template: template,

                // Note, we are passing in the year as data
                templateData: {
                    year: new Date().getFullYear()
                }
            });
        }
    });
