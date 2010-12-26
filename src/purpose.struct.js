(function(ns){
    
    var pp = ns.pp;
    
    /*
    {
        purposes : {
            "foo" : {}
        },
        relations : {
            "foo" : "bar",
            "bar" : "foo"
        },
        objects : {
            // uuid
        }
    }
    */
    pp.struct = {
        purposes : {},
        relations : {},
        objects : {}
    };
    
    var uuidRef = '__purposeObjectUUID' + (+new Date());
    var uuid = 0;
    
    pp.getUUID = function(obj) {
        if (!obj[uuidRef]) obj[uuidRef] = ++uuid;
        return obj[uuidRef];
    };

    pp.hasUUID = function(obj, uuid) {
        if (obj[uuidRef] && (!uuid || obj[uuidRef] == uuid)) return true;
        return false;
    };
    
    pp.getObjectRefByUUID = function(uuid) {
        return pp.struct.objects[uuid];
    };
    
    pp.getObjectRef = function(obj) {
        var uuid = pp.getUUID(obj);
        var o = pp.struct.objects;
        if (o[uuid]) return o[uuid];
        o[uuid] = {
            uuid : uuid,
            ref : obj, // TODO: do not reference DOM elements directly
            relations : {},
            receiving : []
        };
        return o[uuid];
    };
    
    pp.relations = {};
    
    pp.relations.add = function(name, opposite) {
        var r = pp.struct.relations;
        if (r[name]) throw new Error("Could not add relation '" + name + "', already exists.");
        if (opposite && r[opposite]) throw new Error("Could not add opposite relation '" + opposite + "', already exists.");
        r[name] = opposite || name;
        if (opposite) r[opposite] = name;
    };
    
    pp.purpose = function(obj, name) {
        var p = pp.struct.purposes;
        var pn = p[name] = p[name] || {};
        var r = pp.getObjectRef(obj);
        pn[r.uuid] = true;
    };
    
    pp.chains.purpose = function(name) {
        for (var x = 0; x < this.length; x++) {pp.purpose(this[x], name);}
        return this;
    };
    
    pp.receive = function(obj, filter, handler) {
        var r = pp.getObjectRef(obj).receiving;
        r.push({filter : filter || '*', handler : handler});
    };

    pp.chains.receive = function(filter, handler) {
        for (var x = 0; x < this.length; x++) {pp.receive(this[x], filter, handler);}
        return this;
    };
    
})(window);