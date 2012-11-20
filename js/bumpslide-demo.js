// Main JS file for bumpslide demo app

require.config({
    deps:["jquery"],
    paths: {
        'templates': '../templates'
    },
    // add a cache-busting timestamp to all required assets
    urlArgs:"bust=" + (+new Date)
});

require([ 'bumpslide/demo/controller', 'bumpslide/stats', 'plugins'], function (controller, stats) {
    controller.init();
    //stats.show();
});