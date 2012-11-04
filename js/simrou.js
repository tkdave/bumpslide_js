// AMD-wrapper for simrou

define([], function () {

    /**
     * @preserve Simrou v1.5.3 - Released under the MIT License.
     * Copyright (c) 2012 büro für ideen, www.buero-fuer-ideen.de
     */

    var e, a, c = function (f, g) {
        return function () {
            return f.apply(g, arguments)
        }
    }, b = {}.hasOwnProperty, d = [].slice;
    a = (function () {
        f.prototype.RegExpCache = {extractHash: /^[^#]*(#.*)$/, trimHash: /^#*(.*?)\/*$/};
        f.prototype.eventSupported = (function () {
            var g;
            g = window.document.documentMode;
            return"onhashchange" in window && (!(g != null) || g > 7)
        })();
        function f(g) {
            this.handleFormSubmit = c(this.handleFormSubmit, this);
            this.resolveHash = c(this.resolveHash, this);
            this.routes = {};
            this.listening = false;
            this.observeHash = false;
            this.observeForms = false;
            if (g != null) {
                this.addRoutes(g)
            }
        }

        f.prototype.addRoute = function (i, g) {
            var h;
            if (g == null) {
                g = true
            }
            h = i instanceof e ? i : new e(i, g);
            return this.routes[h.toString()] = h
        };
        f.prototype.addRoutes = function (i, h) {
            var n, m, l, j, k, g;
            if (h == null) {
                h = true
            }
            if (jQuery.isFunction(i)) {
                m = i.call(this, h)
            } else {
                if (jQuery.isArray(i)) {
                    m = [];
                    for (k = 0, g = i.length; k < g; k++) {
                        j = i[k];
                        m.push(this.addRoutes(j, h))
                    }
                } else {
                    if (jQuery.isPlainObject(i)) {
                        m = {};
                        for (l in i) {
                            if (!b.call(i, l)) {
                                continue
                            }
                            n = i[l];
                            j = this.addRoute(l, h);
                            j.attachActions(n);
                            m[l] = j
                        }
                    } else {
                        m = this.addRoute(i, h)
                    }
                }
            }
            return m
        };
        f.prototype.removeRoute = function (g) {
            var h;
            if (!(g instanceof e)) {
                g = new e(g)
            }
            h = g.toString();
            if (h in this.routes) {
                return delete this.routes[h]
            }
        };
        f.prototype.navigate = function (h) {
            var g;
            g = this.getHash();
            location.hash = h;
            if (!this.observeHash || location.hash === g) {
                return this.resolve(h, "get")
            }
        };
        f.prototype.resolve = function (l, g) {
            var n, m, i, h, j, o, k;
            i = String(l).replace(this.RegExpCache.trimHash, "$1");
            if (i === "") {
                if (String(l).indexOf("/") === -1) {
                    return false
                } else {
                    i = "/"
                }
            }
            k = this.routes;
            for (h in k) {
                if (!b.call(k, h)) {
                    continue
                }
                o = k[h];
                if (!(o instanceof e)) {
                    continue
                }
                j = o.match(i);
                if (!j) {
                    continue
                }
                m = [j, g];
                n = jQuery(o);
                n.trigger("simrou:any", m);
                if ((g != null) && g !== "any") {
                    n.trigger("simrou:" + g.toLowerCase(), m)
                }
                return true
            }
            return false
        };
        f.prototype.getHash = function (g) {
            if (g == null) {
                g = location.hash
            }
            return String(g).replace(this.RegExpCache.extractHash, "$1")
        };
        f.prototype.resolveHash = function (h) {
            var i, g;
            if (this.observeHash) {
                if (this.eventSupported) {
                    g = h.originalEvent.newURL
                }
                i = this.getHash(g);
                return this.resolve(i, "get")
            }
        };
        f.prototype.handleFormSubmit = function (h) {
            var g, i, j;
            if (this.observeForms) {
                g = jQuery(h.target);
                j = g.attr("method") || g.get(0).getAttribute("method");
                i = this.getHash(g.attr("action"));
                if (this.resolve(i, j)) {
                    h.preventDefault()
                }
            }
            return true
        };
        f.prototype.listen = function () {
            var g = this;
            if (!this.listening) {
                jQuery(window).on("hashchange.simrou", this.resolveHash);
                jQuery(function () {
                    return jQuery("body").on("submit.simrou", "form", g.handleFormSubmit)
                });
                return this.listening = true
            }
        };
        f.prototype.start = function (g, i, h) {
            var j;
            this.observeHash = i != null ? i : true;
            this.observeForms = h != null ? h : true;
            if (this.observeHash || this.observeForms) {
                this.listen()
            }
            j = this.getHash();
            if (j !== "") {
                return this.resolve(j, "get")
            } else {
                if (g != null) {
                    if ((window.history != null) && (window.history.replaceState != null)) {
                        window.history.replaceState({}, document.title, "#" + g.replace(/^#+/, ""));
                        return this.resolve(g, "get")
                    } else {
                        return this.navigate(g)
                    }
                }
            }
        };
        f.prototype.stop = function () {
            this.observeHash = false;
            return this.observeForms = false
        };
        return f
    })();
    e = (function () {
        var f;
        g.prototype.RegExpCache = {escapeRegExp: /[-[\]{}()+?.,\\^$|#\s]/g, namedParam: /:(\w+)/g, splatParam: /\*(\w+)/g, firstParam: /(:\w+)|(\*\w+)/, allParams: /(:|\*)\w+/g};
        function g(k, i) {
            var h, j, l;
            this.pattern = k;
            this.caseSensitive = i != null ? i : true;
            k = String(this.pattern);
            l = k.match(this.RegExpCache.allParams);
            if (l != null) {
                this.params = (function () {
                    var o, n, m;
                    m = [];
                    for (o = 0, n = l.length; o < n; o++) {
                        j = l[o];
                        m.push(j.substr(1))
                    }
                    return m
                })()
            } else {
                this.params = []
            }
            k = k.replace(this.RegExpCache.escapeRegExp, "\\$&");
            k = k.replace(this.RegExpCache.namedParam, "([^/]+)");
            k = k.replace(this.RegExpCache.splatParam, "(.+?)");
            h = i ? "" : "i";
            this.expr = new RegExp("^" + k + "$", h)
        }

        g.prototype.match = function (o) {
            var k, n, j, h, m, i, l;
            n = this.expr.exec(o);
            if (jQuery.isArray(n)) {
                h = {};
                l = this.params;
                for (k = m = 0, i = l.length; m < i; k = ++m) {
                    j = l[k];
                    h[j] = n[k + 1]
                }
            } else {
                h = false
            }
            return h
        };
        g.prototype.assemble = function () {
            var j, i, k, h;
            h = 1 <= arguments.length ? d.call(arguments, 0) : [];
            if (h.length > 0) {
                if (jQuery.isArray(h[0])) {
                    h = h[0]
                } else {
                    if (jQuery.isPlainObject(h[0])) {
                        h = (function () {
                            var o, m, n, l;
                            n = this.params;
                            l = [];
                            for (o = 0, m = n.length; o < m; o++) {
                                j = n[o];
                                l.push(j in h[0] ? h[0][j] : "")
                            }
                            return l
                        }).call(this)
                    }
                }
            }
            i = String(this.pattern);
            while (this.RegExpCache.firstParam.test(i)) {
                k = h.length > 0 ? h.shift() : "";
                if (jQuery.isFunction(k)) {
                    k = k(this)
                }
                i = i.replace(this.RegExpCache.firstParam, String(k))
            }
            return i
        };
        g.prototype.toString = function () {
            return String(this.pattern)
        };
        g.prototype.attachAction = function (h, i) {
            if (i == null) {
                i = "any"
            }
            jQuery(this).on("simrou:" + i.toLowerCase(), h);
            return this
        };
        g.prototype.attachActions = function (n, o) {
            var m, l, i, k, h, j;
            if (o == null) {
                o = "any"
            }
            if (!jQuery.isPlainObject(n)) {
                j = [
                    {},
                    n
                ], n = j[0], i = j[1];
                n[o] = i
            }
            for (o in n) {
                if (!b.call(n, o)) {
                    continue
                }
                l = n[o];
                if (!jQuery.isArray(l)) {
                    l = [l]
                }
                for (k = 0, h = l.length; k < h; k++) {
                    m = l[k];
                    this.attachAction(m, o)
                }
            }
            return this
        };
        g.prototype.detachAction = function (i, j) {
            var h;
            if (j == null) {
                j = "any"
            }
            if (typeof i === "string") {
                j = i
            }
            h = "simrou:" + j.toLowerCase();
            if (jQuery.isFunction(i)) {
                jQuery(this).off(h, i)
            } else {
                jQuery(this).off(h)
            }
            return this
        };
        f = function (h) {
            return function (i) {
                return this.attachAction(i, h)
            }
        };
        g.prototype.get = f("get");
        g.prototype.post = f("post");
        g.prototype.put = f("put");
        g.prototype["delete"] = f("delete");
        g.prototype.any = f("any");
        return g
    })();
    a.Route = e;
    window.Simrou = jQuery.Simrou = a;

    return function (paths) {
       return new  a(paths);
    }

});
