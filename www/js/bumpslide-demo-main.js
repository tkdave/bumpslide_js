// Main JS file

// add a cache-busting timestamp to all required assets
require.config({
    priority:["jquery"],
    deps:["plugins"],
    urlArgs:"bust=" + (+new Date)
});

require(['bumpslide/demo/demoStack', 'bumpslide/stats'], function (demoStack, stats) {

    var holder = $('#bumpslide-demo');
    holder.append(demoStack.el);

    stats.show();

});
