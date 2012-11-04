define(['underscore',
    'bumpslide/view',
    'text!templates/mainView.html',
    './controller',
    './demos/welcomeDemo',
    './demos/animationDemo',
    './demos/mediaLoaderDemo'],
    function (_, view, template, controller, welcomeDemo, animationDemo, mediaLoaderDemo) {

    var demos = {
        'welcome': welcomeDemo(),
        'animation': animationDemo(),
        'media': mediaLoaderDemo()
    };

    var $links, $menu, $holder;

    var self = _.extend(view(), {

        template: template,

        onInit: function () {

            $holder = this.$('.demoHolder')
            $menu = this.$('ul');
            $links = this.$('ul > li > a');

            controller.bind('demo', showDemo);

            tabBar = $('div.tabBar', this.el);
            contentHolder = $('.demoContent', this.el);

            // create buttons
            for (var n = 0; n < demos.length; n++) {
                var label = demos[n].name;
                tabBar.append($('<button>').text(label));
            }

            tabButtons = $('button', tabBar).click(onTabClick);

            model.bind('selectedIndex', onDemoChange, true);

        },

        showDemo: function (demoName) {

            if(currentDemo) currentDemo.hide();
        }
    });

    self.show();

    return self;

    function onTabClick() {
        model.set('selectedIndex', $(this).index());
    }

    function onDemoChange(selectedDemo) {

        // update tab state
        tabButtons.each(function () {
            var btn = $(this);
            btn.toggleClass('selected', btn.index() == selectedDemo);
        });

        // hide any demo views and remove them
        _.each(demos, function (v) {
            v.hide();
        });

        contentHolder.children().remove();

        _.delay(function () {
            // show the current demo
            var demo = demos[selectedDemo];
            demo.show();
            contentHolder.append(demo.el);
        }, 100);


    }

});