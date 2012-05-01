define(['underscore', 'bumpslide/view', 'text!./demoStack.html', './animationDemo', './mediaLoaderDemo', 'bumpslide/bindable'], function (_, view, template, animationDemo, mediaLoaderDemo, bindable) {

    var demos = [ animationDemo(), mediaLoaderDemo() ];
    var model = bindable({ selectedIndex:0 });
    var tabButtons, tabBar, contentHolder;

    var self = view.extend({
        template:template,
        onInit:function () {

            tabBar = $('div.tabBar', this.el);
            contentHolder =  $('.demoContent', this.el);

            // create buttons
            for (var n = 0; n < demos.length; n++) {
                var label = demos[n].name;
                tabBar.append($('<button>').text(label));
            }

            tabButtons = $('button', tabBar).click(onTabClick);

            model.bind('selectedIndex', onDemoChange, true);

        }
    });

    self.show();

    return self;

    function onTabClick() {
        model.set('selectedIndex', $(this).index());
    }

    function onDemoChange(selectedDemo) {

        // update tab state
        tabButtons.each( function() {
            var btn = $(this);
            btn.toggleClass('selected', btn.index() == selectedDemo);
        });

        // hide any demo views and remove them
        _.each(demos, function (v) {
            v.hide();
        });

        contentHolder.children().remove();

        _.delay( function (){
            // show the current demo
            var demo = demos[selectedDemo];
            demo.show();
            contentHolder.append( demo.el );
        }, 100);


    }

});