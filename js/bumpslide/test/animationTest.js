define(['bumpslide/animation', 'underscore'], function (animation, _)
{
    asyncTest('bumpslide.animation', function ()
    {
        var anim = animation( render );

        console.log( anim );
        var count = 0;
        var startTime = (+new Date);

        ok( startTime>0, 'valid start time');

        ok(anim, 'anim exists');

        anim.play();


        function render(time) {

            var now = (+new Date);
            var runTime = time-startTime;

            //console.log('render:', time, runTime, count);

            // only run this once
            if(count==3) {
                ok( _.isNumber(time), 'Render function should pass in the time from requestAnimFrame as a number (time: '+time+')');
                ok( time<=now, 'Animation time should be less than or equal to the current time (now: '+now+')');
                ok( runTime >= 0, 'Run time should not be less than zero. (runTime:'+runTime+')');
            }

            count++;

            // let this run for half a second
            if(runTime > 500) {

                // calculate FPS
                var fps = (1000 * count/runTime).toFixed(3);
                ok( fps > 45 && fps < 75, 'FPS should be around 60 fps ('+fps+' fps)');
                anim.stop();

                // restart qunit
                start();
            }

        }
    });





});