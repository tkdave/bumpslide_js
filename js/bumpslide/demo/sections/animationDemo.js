define(['underscore', 'bumpslide/canvasUtil', 'bumpslide/animation', 'bumpslide/view', 'text!templates/animation.html' ],
    function (_, canvasUtil, animation, view, template) {

        /**
         * Animation Demo
         */
        return function () {

            var $box;
            var anim = animation( loop );

            var self = _.extend(view(), {

                template: template,

                onInit: function () {
                    $box = $('.box', self.el);
                },

                onShow: function () {
                    anim.play();
                    $box.on( 'mousedown', onTouch);
                },

                onHide: function () {
                    anim.stop();
                    $box.off( 'mousedown', onTouch);
                }
            });

            function onTouch() {
                console.log('play pause');
                anim.togglePlayPause();
            }

            function loop(t) {

                // box color changes based on animation time
                var brightness = .7;
                var rgb = [
                    brightness * 255 * .5 * (Math.sin(t / 222) + 1) >> 0,
                    brightness * 220 * .5 * (Math.sin(t / 333) + 1) >> 0,
                    brightness * 255 * .5  *(Math.sin(t / 444) + 1) >> 0
                ];
                $box.css('background-color',  'rgb(' + rgb + ')');
            }

            return self;
        }
    });