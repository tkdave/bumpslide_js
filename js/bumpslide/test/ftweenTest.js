define(['jquery', 'underscore', 'bumpslide/ftween', 'bumpslide/bindable'], function ($, _, ftween, bindable) {

/*
    asyncTest('bumpslide.ftween (global ftween.stop)', function () {

        stop();

        // Test object tweening
        var obj = {
            x: 10
        };

        _.delay(function () {

            //ftween(obj, 'x', 0, {gain: .001});
            //ftween.stopAll();
            ok(ftween.getActiveTweens().length == 0, 'No active tweens');

            ftween(obj, 'x', 0, {gain: .001});
            ftween(obj, 'y', 0, {gain: .001});
            ok(ftween.getActiveTweens().length == 2, 'There are two active tweens');

            ftween.stop(obj, 'y');
            ok(ftween.getActiveTweens().length == 1, 'After stop, there is one active tween');

            ftween(obj, 'y', 0, {gain: .001});
            ok(ftween.getActiveTweens().length == 2, 'One more tween added');

            ftween.stop(obj);
            ok(ftween.getActiveTweens().length == 0, 'After stop all on obj, there are no active tweens');


            start();


        }, 1000);


    });
*/

    asyncTest('bumpslide.ftween (tweening object props)', function () {

        stop();

        // Test object tweening
        var obj = {
            x: 10
        };

        ftween(obj, 'x', 0, {gain: .5, minDelta: 1, onUpdate: function (tw) {
            console.log('Updated Tween', tw);
        }});

        _.delay(checkIt, 500);

        function checkIt() {
            ok(obj.x == 0, 'obj.x was tweened to 0');
            start();
        }


    });

    asyncTest('bumpslide.ftween (tweening getter/setter)', function () {

        stop();

        var $div = $('<div>').css({width: '100px'});

        ok($div != null, 'div created successfully');
        ok(_.isFunction($div.width), 'div.width is a function');

        var tw = ftween($div, $div.width, 200, { gain: .5 });

        ok(_.isObject(tw), 'tween is an object');

        //ok(_.isFunction(tw.stop), 'tween can be stopped');


        _.delay(function () {
            ok($div.width() === 200, 'div width was tweened to 200');
            start();
        }, 500);


    });


    asyncTest('bumpslide.ftween (tweening bindable getter/setter)', function () {

        stop();
        var model = bindable({x: 100, y: 100});

        var component = {
            x: model.getSet('x'),
            y: model.getSet('y')
        };

        component.x(100);
        ok(component.x() == 100, 'making sure getter setter works');

        model.bind('x', function (x) {
            console.log('x is now:' + x);
        });

        ftween(component, component.x, 200, {gain: .5});

        _.delay(function () {
            ok(component.x() === 200, 'component x was tweened to 200');
            start();
        }, 500);


    });


    test('bumpslide.ftween (instance.stop)', function () {

        // Test object tweening
        var obj = {
            x: 10
        };

        ftween.stopAll();
        var tween = ftween(obj, 'x', 0, {gain: .001, onUpdate: function(tween){
            console.log( 'tween: ', tween);
        }});
        tween.stop();
        ok(obj.x == 10, 'value not changed if tween immediately stopped (x='+obj.x+')');



    });


    asyncTest('bumpslide.ftween (updates and tween re-use)', function () {

        stop();

        // Test object tweening
        var obj = {
            x: 10,
            y: 10,

        };

        var tween1 = ftween(obj, 'x', 0, {gain: .001});
        var tween2 = ftween(obj, 'x', 1, {gain: .1});
        var tween3 = ftween(obj, 'y', 0, {gain: .1});
        var tween4 = ftween(obj, 'y', 1);

        ok(tween1 === tween2, 'tweens on the same object and property are re-used');
        ok(tween1 !== tween3, 'tweens on the same object and different property are separate');

        console.log(tween1.options, tween2.options);

        ok(tween1.options.gain === .1, 'options are updated when ftween is called again');
        ok(tween1.target === 1, 'target is updated when ftween is called again');
        ok(tween4.options.gain === .1, 'options are not overwritten by subsequent calls');

        start();




    });


});