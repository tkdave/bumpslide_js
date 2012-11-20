define(['bumpslide/view', 'text!templates/ftween.html', 'bumpslide/ftween'],
    function(view, template, ftween) {

    /**
     * FTween Demo
     */
    return function () {

        var self = _.extend( view(), {

            template: template,

            onInit: function () {
                $box = self.$('.box');
                self.el.on('click', 'button', onClick);
            },

            onDestroy: function () {
                self.el.off('click', 'button', onClick);
            }
        });

        var $box;

        function onClick() {
            var options = {
                gain:.05,
                onUpdate: onTweenUpdate,
                onComplete: onTweenComplete
            };
            var w = 100 + Math.round( Math.random() * 500 );
            ftween( $box, $box.width, w, options);
        }

        function onTweenUpdate(tween) {
            self.trigger('note', 'Tween is Complete');
        }

        function onTweenComplete() {
            self.trigger('note', 'Tween is Complete');
        }
        return self;
    }
});
