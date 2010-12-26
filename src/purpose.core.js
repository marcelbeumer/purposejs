/* -------------------------------------------------------
//////////////////////////////////////////////////////////
purpose.js
//////////////////////////////////////////////////////////
------------------------------------------------------- */
(function(ns){
    var VERSION = "{{PP_VERSION}}";
    var prevNS = ns.pp;

    var pp = ns.pp = function(query, context) {
        return new Chain(query, context);
    };
    
    pp.version = VERSION;
    
    pp.noConflict = function() {
        ns.pp = prevNS;
        return pp;
    };
    
    pp.isFunction = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Function]";
    };
    
    pp.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

    pp.isString = function(obj) {
        return Object.prototype.toString.call(obj) === "[object String]";
    };

    pp.isObject = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    };
    
    pp.merge = function( first, second ) {
        var i = first.length, j = 0;
        if (typeof second.length === "number") {
            for (var l = second.length; j < l; j++) {
                first[i++] = second[j];
            }
        } else {
            while (second[j] !== undefined) {
                first[i++] = second[j++];
            }
        }
        first.length = i;
        return first;
    };
    
    pp.extend = function(firstObj, secondObj) {
        for (var name in secondObj) {
            if (secondObj.hasOwnProperty(name)) firstObj[name] = secondObj[name];
        }
        return firstObj;
    };
    
    var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
    pp.trim = function(str) {
        return (str || "").replace(rtrim, "" );
    };
    
    pp.chains = {};
    
    var Chain = function(query, context) {
        this.length = 0;
        if (!query) {
            // no query, no nodes!
        } else if (pp.isString(query)) {
            // we got passed a purpose selector
            // TODO:
        } else if (pp.isFunction(query)) {
            
            // TODO: no such thing
            
        } else if (query.length !== undefined) {
            // we got passed an array
            pp.merge(this, query);
        } else {
            // we got passed a single object
            this.length = 1;
            this[0] = query;
        }
        return this;
    };
    
    Chain.prototype = pp.chains;

    var pushStack = function(obj, selector) {
        var n = im(selector);
        n.__prev = obj;
        return n;
    };
    
    pp.chains.reset = function(selector) {
        return pushStack(this, selector);
    };

    pp.chains.end = function() {
        return this.__prev || im();
    };
    
    pp.chains.exec = function(fn) {
        fn.apply(this);
        return this;
    };

    pp.chains.array = function() {
        var a = [];
        pp.merge(a, this);
        return a;
    };
    
    pp.chains.item = function(number) {
        number = number || 0;
        if (this.length > number && this[number]) return this.reset(this[number]);
        return this.reset();
    };
    
    pp.chains.object = function(number) {
        number = number || 0;
        if (this.length > number && this[number]) return this[number];
    };
    
    pp.each = function(obj, callback) {
        var length = obj.length;
        var isObject = length === undefined || pp.isFunction(obj);
        
        if (isObject) {
            var name;
            for (name in obj) {
                if (callback.call(obj[name], name, obj[name]) === false ) break;
            }
        } else {
            var i = 0;
            for (var value = obj[0]; i < length && callback.call(value, i, value) !== false; value = obj[++i] ) {}
        }
    };
    
    pp.chains.each = function(callback) {
        pp.each(this, callback);
        return this;
    };
    
})(window);
