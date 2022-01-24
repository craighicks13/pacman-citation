System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Node;
    return {
        setters:[],
        execute: function() {
            Node = (function () {
                function Node(x, y, walkable) {
                    if (walkable === void 0) { walkable = true; }
                    this.x = x;
                    this.y = y;
                    this.walkable = walkable;
                    this.costMultiplier = 1;
                }
                return Node;
            }());
            exports_1("Node", Node);
        }
    }
});
//# sourceMappingURL=Node.js.map