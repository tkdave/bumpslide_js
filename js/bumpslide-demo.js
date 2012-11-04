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
    stats.show();
});

// make it safe to use console.log always
try{(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});}catch(e){}
