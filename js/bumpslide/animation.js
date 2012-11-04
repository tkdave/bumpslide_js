define(['underscore', './playable'], function (_, playable) {

    // tweaked version of Paul Irish's requestAnimFrame
    // shim layer with setTimeout fallback - see https://gist.github.com/979055
    (function () {
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (b, a) {
                return window.setTimeout(function () {
                    b(+new Date);
                }, 1000 / 60);
            }
        })();
        window.cancelRequestAnimFrame = (function () {
            return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout;
        })()
    })();

    /**
     *  bumpslide.animation
     *  ===================
     *
     *  This is a requestAnimationFrame shim with a little syntactic sugar.
     *  It implements the bumpslide.playable interface.
     *
     *  For more advanced control, use bumpslide.timeline which wraps this
     *  with pause, timing, and media sync functions.
     *
     *  Example:
     *  `
     *    var myIntroAnim = animation( renderIntro );
     *
     *    function renderIntro( time ) {
     *      intro.css({left: Math.sin( time/1000 * Math.PI*2 ) * 200 });
     *    }
     *
     *    myIntroAnim.play();
     *
     *    setTimeout( function() {
     *      myIntroAnim.stop();
     *    }, 3000 );
     *  `
     *  @author David Knape, http://bumpslide.com/
     */
    return function (render_function, element_scope) {

        var animRequest = null;

        var self = _.extend(playable(), {

            onPlayStateChange: function (play) {
                if (play) {
                    doRender(+new Date);
                } else {
                    window.cancelRequestAnimFrame(animRequest);
                }
            },

            setRenderFunction: function (func) {
                render_function = func;
            }

        });

        return self;

        function doRender(time) {

            // cancel doesn't work on old mozilla
            // return if paused (don't request another frame)
            if (!self.isPlaying()) return;

            // call the render function
            if (_.isFunction(render_function)) render_function(time);

            // again...
            window.cancelRequestAnimFrame(animRequest);
            animRequest = window.requestAnimFrame(doRender, element_scope);
        }
    };


});

