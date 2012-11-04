/**
 *  Grid Iterator
 */
define([], function () {
    return function (cols, rows, data, func, scope) {
        var len=rows*cols;
        for( var i=0; i<len; i++ ) func.call( scope,  data[i], i % cols, Math.floor(i / cols), i );
    }
});