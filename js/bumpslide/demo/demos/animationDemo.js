define(['underscore', 'bumpslide/canvasUtil', 'bumpslide/animation', 'bumpslide/view' ], function (_, canvasUtil, animation, view) {

    /**
     * animationDemo() view component
     */
    return function () {

        // our private little canvas
        var canvas = canvasUtil.create(640, 128);
        var canvas_ctx = canvas.getContext('2d');

        // our animation loop
        var colorCycleAnimation = animation( renderPrettyColors );


        return _.extend( view(), {
            name: 'Animation Demo',
            onShow:onShow,
            onHide:onHide
        });

        function onShow() {
            this.el.append( canvas );
            colorCycleAnimation.play();
        }

        function onHide() {
            this.el.children().remove();
            colorCycleAnimation.stop();
        }

        function renderPrettyColors(t) {

            // beautiful by design
            var brightness = .6;
            var rgb = [
                brightness * 128 * (Math.sin(t / 222) + 1) >> 0,
                brightness * 128 * (Math.sin(t / 333) + 1) >> 0,
                brightness * 128 * (Math.sin(t / 444) + 1) >> 0
            ];

            canvas_ctx.fillStyle = 'rgb(' + rgb + ')';
            canvas_ctx.fillRect(0, 0, canvas.width, canvas.height);

        }


    }


});