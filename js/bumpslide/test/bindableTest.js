define(['bumpslide/bindable'], function (bindable) {

    test('bumpslide.bindable', function () {

        var notes = [],
            m = bindable({ age:25, message:"Hello" });

        // add a note each time change is detected
        // these notes will be used for testing purposes
        var onchange = function (age) {
            notes.push('age is now ' + age);
        };

        // test removable change handler
        m.bind('age', onchange);

        m.set('age', 20); //1
        m.set('age', 30); //2

        m.set('age', 40); //3

        equal( notes.length, 3, 'Change handler should fire once each time value is changed.');

        m.set('age', 40); // won't fire notification
        equal( notes.length, 3, 'Change handler should not fire when value is set to the existing value.');

        m.unbind('age', onchange);
        m.set('age', 50); // won't call our change handler

        equal( notes.length, 3, 'Change handler should not fire after it is unbound.');

        notes = [];

        // test unbinding of inline handler
        m.bind('age', function (age) {
            notes.push('age is now ' + age);
        });

        m.set('age', 40);
        m.unbind('age');
        m.set('age', 50);

        equal(notes.length, 1, 'Calling unbind with no handler should remove all handlers for that property.');


        // test getter setter
        var data = bindable();
        var component = {
            x: data.getSet('x'),
            y: data.getSet('y')
        };

        data.bind('x', function(x) {
            ok( x===25, 'Setter triggers binding.' );
        });
        component.x( 25 );
        ok( component.x() === 25, 'Getter returns previously set value' );



    });






});