define(['bumpslide/dispatcher', 'underscore'], function (dispatcher, _)
{
    test('Dispatcher stand-alone', function ()
    {
        var hits=0;
        function onHello(event, data) {
            hits++;
            ok(true, 'Event handler should fire.');
            ok(data=='David', 'Event data should be passed through.');
        }
        // dispatcher as instance created by function
        var d = dispatcher();
        d.bind('Hello', onHello );
        d.trigger('Hello', 'David');
        d.unbind('Hello', onHello);
        ok(hits==1, 'Event handler should have only fired once.');
    });

    test('Dispatcher applied', function () {
        var hits=0;
        function onHello(event, data) {
            hits++;
            ok(true, 'Event handler should fire.');
            ok(data=='David', 'Event data should be passed through.');
        }
        // test dispatcher as regular object that is being decorated
        var d = {};
        _.extend( d, dispatcher() );
        d.bind('Hello', onHello );
        d.trigger('Hello', 'David');
        d.unbind('Hello', onHello);
        ok(hits==1, 'Event handler should have only fired once.');

    });




});