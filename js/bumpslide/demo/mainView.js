define(['underscore', 'bumpslide/view', 'text!templates/mainView.html', './controller', './state'],
    function (_, view, template, controller, state) {

        var $mainContent, $title, $links, $menu, $holder, $source;

        var currentSection = null;

        var self = _.extend(view(), {

            template: template,

            onInit: function () {

                $mainContent = this.$('.mainContent');
                $holder = this.$('.demoContent');
                $source = this.$('.demoSource');
                $menu = this.$('ul');
                $title = this.$('.demoTitle');
                $links = this.$('ul > li > a');
                state.bind('section', onSectionChange);
            },

            onDestroy: function () {
                state.unbind('section', onSectionChange);
            }

        });

        function onSectionChange(sectionName) {

            if (currentSection) {
                currentSection.destroy();
            }

            $links.each( function() {
                var $link = $(this);
                $link.toggleClass('selected', $link.attr('href')=='#/'+sectionName);
            });

            $title.empty();
            $holder.empty();
            $source.empty();

            $mainContent.stop(true, true).hide();


            if (sectionName) {
                require(["bumpslide/demo/sections/" + sectionName + "Demo"], function (demoView) {
                    currentSection = demoView();
                    currentSection.init();
                    currentSection.show();
                    $title.html(currentSection.title);
                    $holder.empty();
                    $holder.append(currentSection.el);
                    $source.load("js/bumpslide/demo/sections/" + sectionName + "Demo.js");

                    $mainContent.stop(true, true).fadeIn(500);
                });

            }


        }

        return self;

    });