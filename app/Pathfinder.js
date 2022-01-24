System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Pathfinder;
    return {
        setters:[],
        execute: function() {
            Pathfinder = (function () {
                function Pathfinder() {
                    this._heuristic = this.manhattan;
                    //private _heuristic:Function = this.eulidian;
                    //private _heuristic:Function = this.diagonal;
                    this._straightCost = 1.0;
                    this._diagCost = Math.SQRT2 * 10;
                }
                Pathfinder.prototype.findPath = function (grid) {
                    this._grid = grid;
                    this._open = [];
                    this._closed = [];
                    this._startNode = this._grid.startNode;
                    this._endNode = this._grid.endNode;
                    this._startNode.g = 0;
                    this._startNode.h = this._heuristic(this._startNode);
                    this._startNode.f = this._startNode.g + this._startNode.h;
                    return this.search();
                };
                Pathfinder.prototype.search = function () {
                    var node = this._startNode;
                    while (node != this._endNode) {
                        var startX = Math.max(0, node.x - 1);
                        var endX = Math.min(this._grid.numCols - 1, node.x + 1);
                        var startY = Math.max(0, node.y - 1);
                        var endY = Math.min(this._grid.numRows - 1, node.y + 1);
                        for (var i = startX; i <= endX; i++) {
                            for (var j = startY; j <= endY; j++) {
                                var test = this._grid.getNode(i, j);
                                if (test == node || !test.walkable)
                                    continue;
                                var cost = this._straightCost;
                                if (!((node.x == test.x) || (node.y == test.y))) {
                                    cost = this._diagCost;
                                }
                                var g = node.g + (cost * test.costMultiplier);
                                var h = this._heuristic(test);
                                var f = g + h;
                                if (this.isOpen(test) || this.isClosed(test)) {
                                    if (test.f > f) {
                                        test.f = f;
                                        test.g = g;
                                        test.h = h;
                                        test.parent = node;
                                    }
                                }
                                else {
                                    test.f = f;
                                    test.g = g;
                                    test.h = h;
                                    test.parent = node;
                                    this._open.push(test);
                                }
                            }
                        }
                        this._closed.push(node);
                        if (this._open.length == 0) {
                            console.log("no path found");
                            return false;
                        }
                        this._open.sort(function (a, b) {
                            if (a.f < b.f)
                                return -1;
                            if (a.f > b.f)
                                return 1;
                            return 0;
                        });
                        node = this._open.shift();
                    }
                    this.buildPath();
                    return true;
                };
                Pathfinder.prototype.buildPath = function () {
                    this._path = [];
                    var node = this._endNode;
                    this._path.push(node);
                    while (node != this._startNode) {
                        node = node.parent;
                        this._path.unshift(node);
                    }
                };
                Object.defineProperty(Pathfinder.prototype, "path", {
                    get: function () {
                        return this._path;
                    },
                    enumerable: true,
                    configurable: true
                });
                Pathfinder.prototype.isOpen = function (node) {
                    for (var i = 0; i < this._open.length; i++) {
                        if (this._open[i] == node) {
                            return true;
                        }
                    }
                    return false;
                };
                Pathfinder.prototype.isClosed = function (node) {
                    for (var i = 0; i < this._closed.length; i++) {
                        if (this._closed[i] == node) {
                            return true;
                        }
                    }
                    return false;
                };
                Pathfinder.prototype.manhattan = function (node) {
                    return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
                };
                Pathfinder.prototype.eulidian = function (node) {
                    var dx = node.x - this._endNode.x;
                    var dy = node.y - this._endNode.y;
                    return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
                };
                Pathfinder.prototype.diagonal = function (node) {
                    var dx = Math.abs(node.x - this._endNode.x);
                    var dy = Math.abs(node.y - this._endNode.y);
                    var diag = Math.min(dx, dy);
                    var straight = dx + dy;
                    return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
                };
                Object.defineProperty(Pathfinder.prototype, "visited", {
                    get: function () {
                        return this._closed.concat(this._open);
                    },
                    enumerable: true,
                    configurable: true
                });
                return Pathfinder;
            }());
            exports_1("Pathfinder", Pathfinder);
        }
    }
});
//# sourceMappingURL=Pathfinder.js.map