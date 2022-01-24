System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Dictionary;
    return {
        setters:[],
        execute: function() {
            Dictionary = (function () {
                function Dictionary() {
                    this.items = {};
                    this.count = 0;
                }
                Dictionary.prototype.ContainsKey = function (key) {
                    return this.items.hasOwnProperty(key);
                };
                Dictionary.prototype.Count = function () {
                    return this.count;
                };
                Dictionary.prototype.Add = function (key, value) {
                    this.items[key] = value;
                    this.count++;
                };
                Dictionary.prototype.Remove = function (key) {
                    var val = this.items[key];
                    delete this.items[key];
                    this.count--;
                    return val;
                };
                Dictionary.prototype.Item = function (key) {
                    return this.items[key];
                };
                Dictionary.prototype.Keys = function () {
                    var keySet = [];
                    for (var prop in this.items) {
                        if (this.items.hasOwnProperty(prop)) {
                            keySet.push(prop);
                        }
                    }
                    return keySet;
                };
                Dictionary.prototype.Values = function () {
                    var values = [];
                    for (var prop in this.items) {
                        if (this.items.hasOwnProperty(prop)) {
                            values.push(this.items[prop]);
                        }
                    }
                    return values;
                };
                return Dictionary;
            }());
            exports_1("Dictionary", Dictionary);
        }
    }
});
//# sourceMappingURL=Dictionary.js.map