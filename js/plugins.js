// misc jquery plugins and global helpers

// make it safe to use console.log always
try{(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});}catch(e){}

// make sure we have Array.indexOf in IE
if (!('indexOf' in Array.prototype)){Array.prototype.indexOf=function(find,i){if(i===undefined)i=0;if(i<0)i+=this.length;if(i<0)i=0;for(var n=this.length;i<n;i++)if(i in this && this[i]===find) return i; return -1;};}