// add a cache-busting timestamp to all required assets
require.config({ urlArgs:"bust=" + (+new Date), baseUrl: 'js' });

require([
    'bumpslide/test/bindableTest',
    'bumpslide/test/dispatcherTest',
    'bumpslide/test/animationTest'
], function () {

});