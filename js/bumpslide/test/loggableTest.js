define(['bumpslide/loggable', 'underscore'], function (loggable, _)
{

    test('bumpslide.loggable', function () {

        var called = 0;

        var logger = loggable();
        ok(logger.logEnabled===false, 'Log should be disabled by default.');

        logger = loggable(true);
        ok(logger.logEnabled===true, 'Log should be enabled if you pass true into the constructor.');

        //logger.log('Hello, World. From the logger.');

        // add a custom log function that counts logs
        logger.logFunction = function () {
            called++;
        };

        // test that log function is called
        logger.log('Hello');
        ok(called===1, "Log function should have been called if log was enabled.");

        // disable and log again
        logger.logEnabled = false;
        logger.log('Hi, Again');
        ok(called===1, "Log function should not have been called if log was disabled.");


    });







});