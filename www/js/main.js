// Main JS file

// add a cache-busting timestamp to all required assets
require.config({ urlArgs:"bust=" + (+new Date)});

require(['bumpslide/canvasUtil', 'bumpslide/animation', 'bumpslide/demo/panel' ], function (canvasUtil, animation, panel) {

    // be somebody
    (function() {

        var holder = $('#holder');
        var canvas = canvasUtil.create(960, 64);
        var canvas_ctx = canvas.getContext('2d');

        var main_panel = panel('Animation Demo', canvas );
        main_panel.init().show();
        holder.append( main_panel.el );
        var trace = $('#trace');
        var anim = animation( draw );

        anim.run();

        function draw(t) {

            var r = 128 * (Math.sin(t/130) + 1) >> 0;
            var g = 128 * (Math.sin(t/170) + 1) >> 0;
            var b = 128 * (Math.sin(t/190) + 1) >> 0;
            canvas_ctx.fillStyle = 'rgb('+[r,g,b]+')';
            canvas_ctx.fillRect(0, 0, canvas.width, canvas.height);

            trace.text(''+[r,g,b]);
        }
        
        
        
    })();
    
    
});
