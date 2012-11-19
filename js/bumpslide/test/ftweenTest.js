define(['bumpslide/ftween', 'bumpslide/bindable', 'underscore'], function (ftween, bindable, _)
{

    test('bumpslide.ftween', function () {


        var obj = {
            x: 100
        };

        stop();

        ftween( obj, 'x', 0 );

        _.delay(function(){
            ok(obj.x==0, 'obj.x was tweened to 0');
        }, 500);


    });







});