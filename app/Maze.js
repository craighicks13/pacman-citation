System.register(['./Constants', './Node'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Constants_1, Constants_2, Node_1;
    var Maze;
    return {
        setters:[
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
                Constants_2 = Constants_1_1;
            },
            function (Node_1_1) {
                Node_1 = Node_1_1;
            }],
        execute: function() {
            Maze = (function (_super) {
                __extends(Maze, _super);
                function Maze() {
                    _super.call(this);
                    this.mouseEnabled = true;
                    this._pellets = new createjs.Container();
                    this.addChild(this._pellets);
                    this._numCols = Constants_1.Constants.MAZE_MAP[0].length;
                    this._numRows = Constants_1.Constants.MAZE_MAP.length;
                    this._nodes = [];
                    for (var i = 0; i < this._numCols; i++) {
                        this._nodes[i] = [];
                        for (var j = 0; j < this._numRows; j++) {
                            this._nodes[i][j] = new Node_1.Node(i, j, Constants_1.Constants.MAZE_MAP[j].charAt(i) === '0');
                            this._nodes[i][j].pixelX = ((i) * Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2;
                            this._nodes[i][j].pixelY = ((j) * Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2;
                        }
                    }
                    this.Grayscale = new createjs.ColorMatrixFilter([
                        0.30, 0.30, 0.30, 0, 0,
                        0.30, 0.30, 0.30, 0, 0,
                        0.30, 0.30, 0.30, 0, 0,
                        0, 0, 0, .15, 0 // alpha
                    ]);
                }
                Maze.prototype.getNode = function (x, y) {
                    return this._nodes[x][y];
                };
                Maze.prototype.setWalkable = function (x, y, value) {
                    this._nodes[x][y].walkable = value;
                };
                Maze.prototype.setEndNode = function (x, y) {
                    this._endNode = this._nodes[x][y];
                };
                Maze.prototype.setStartNode = function (x, y) {
                    this._startNode = this._nodes[x][y];
                };
                Object.defineProperty(Maze.prototype, "endNode", {
                    get: function () {
                        return this._endNode;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Maze.prototype, "numCols", {
                    get: function () {
                        return this._numCols;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Maze.prototype, "numRows", {
                    get: function () {
                        return this._numRows;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Maze.prototype, "startNode", {
                    get: function () {
                        return this._startNode;
                    },
                    enumerable: true,
                    configurable: true
                });
                Maze.prototype.updateNodeCosts = function (value, id) {
                    this._nodes.forEach(function (col, i) {
                        col.forEach(function (node, j) {
                            if (node.walkable) {
                                node.costMultiplier = value.checkWalkable(node.pixelX, node.pixelY, id) ? 100 : 1;
                            }
                        });
                    });
                };
                Maze.prototype.setMaze = function (value, category) {
                    var _this = this;
                    var img = document.createElement("img");
                    img.crossOrigin = "Anonymous";
                    img.onload = function () {
                        _this._canvas = _this._maze.getBounds() || { width: 913, height: 680 };
                        _this._gridWidth = _this._canvas.width - Constants_1.Constants.MAP_BORDER * 2;
                        _this._gridHeight = _this._canvas.height - Constants_1.Constants.MAP_BORDER * 2;
                        _this._maze.cache(0, 0, _this._canvas.width, _this._canvas.height);
                        _this._background = new createjs.Shape();
                        _this.updateMazeColor(category);
                        _this.addChildAt(_this._background, 0);
                        _this.dispatchEvent(Constants_1.Constants.MAZE_LOADED);
                    };
                    img.src = value;
                    console.log('create bitmap');
                    this._maze = new createjs.Bitmap(value);
                };
                Maze.prototype.mazeHeight = function () {
                    return this._canvas.height;
                };
                Maze.prototype.mazeWidth = function () {
                    return this._canvas.width;
                };
                Maze.prototype.updateMazeColor = function (category) {
                    var colors = Constants_1.Constants.CATEGORY_LIST.category[category].colours;
                    if (this._background) {
                        this._background.uncache();
                    }
                    this._background.graphics.clear();
                    this._background.graphics.beginLinearGradientFill([
                        ("rgba(" + colors[0].RED + "," + colors[0].GREEN + "," + colors[0].BLUE + ",1)"),
                        ("rgba(" + colors[1].RED + "," + colors[1].GREEN + "," + colors[1].BLUE + ",1)")], [0, 1], 0, 0, this._maze.getBounds().width * .65, this._maze.getBounds().width * .5);
                    this._background.graphics.drawRect(0, 0, this._maze.getBounds().width, this._maze.getBounds().height);
                    this._background.cache(0, 0, this._canvas.width, this._canvas.height);
                    this._background.filters = [new createjs.AlphaMaskFilter(this._maze.cacheCanvas)];
                    this._background.updateCache();
                };
                Maze.prototype.initPellets = function (value) {
                    var _this = this;
                    this._pellets.removeAllChildren();
                    Constants_1.Constants.MAZE_MAP.forEach(function (item, index) {
                        var row = item.split('');
                        row.forEach(function (ritem, rindex) {
                            if (ritem == '0') {
                                var pellet = new createjs.Bitmap(value);
                                pellet.x = Constants_1.Constants.MAP_BORDER + (Constants_1.Constants.MAP_GAP * .5) + (Constants_1.Constants.MAP_GAP * rindex);
                                pellet.y = Constants_1.Constants.MAP_BORDER + (Constants_1.Constants.MAP_GAP * .5) + (Constants_1.Constants.MAP_GAP * index);
                                _this._pellets.addChild(pellet);
                                var next = rindex + 1;
                                if (next < row.length && row[next] == '0' && !(rindex == 10 && index == 10)) {
                                    var pellet = new createjs.Bitmap(value);
                                    pellet.x = Constants_1.Constants.MAP_BORDER + (Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * rindex);
                                    pellet.y = Constants_1.Constants.MAP_BORDER + (Constants_1.Constants.MAP_GAP * .5) + (Constants_1.Constants.MAP_GAP * index);
                                    _this._pellets.addChild(pellet);
                                }
                                next = index + 1;
                                if (next < Constants_1.Constants.MAZE_MAP.length && Constants_1.Constants.MAZE_MAP[next].charAt(rindex) == '0') {
                                    var pellet = new createjs.Bitmap(value);
                                    pellet.x = Constants_1.Constants.MAP_BORDER + (Constants_1.Constants.MAP_GAP * .5) + (Constants_1.Constants.MAP_GAP * rindex);
                                    pellet.y = Constants_1.Constants.MAP_BORDER + (Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * index);
                                    _this._pellets.addChild(pellet);
                                }
                            }
                        });
                    });
                };
                Maze.prototype.nextBlock = function (direction) {
                    var r;
                    try {
                        switch (direction) {
                            case Constants_2.Direction.RIGHT:
                                r = Constants_1.Constants.MAZE_MAP[this._currentRow - 1].charAt(this._currentColumn);
                                break;
                            case Constants_2.Direction.LEFT:
                                r = Constants_1.Constants.MAZE_MAP[this._currentRow - 1].charAt(this._currentColumn - 2);
                                break;
                            case Constants_2.Direction.UP:
                                r = Constants_1.Constants.MAZE_MAP[this._currentRow - 2].charAt(this._currentColumn - 1);
                                break;
                            case Constants_2.Direction.DOWN:
                                r = Constants_1.Constants.MAZE_MAP[this._currentRow].charAt(this._currentColumn - 1);
                                break;
                            case Constants_2.Direction.NONE:
                                r = '1';
                                break;
                        }
                    }
                    catch (e) {
                        r = '1';
                    }
                    finally {
                        return r == '0';
                    }
                };
                Maze.prototype.getGridLocation = function (value) {
                    value.x = (value.column * Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2;
                    value.y = (value.row * Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2;
                    return value;
                };
                Maze.prototype.isGridAvailable = function (value) {
                    return Constants_1.Constants.MAZE_MAP[value.row - 1].charAt(value.column - 1) == "0";
                };
                Maze.prototype.getCurrentGrid = function (herox, heroy) {
                    this._currentColumn = Math.round(herox / Constants_1.Constants.MAP_GAP);
                    this._currentRow = Math.round(heroy / Constants_1.Constants.MAP_GAP);
                    return {
                        column: this._currentColumn,
                        row: this._currentRow,
                        x: (this._currentColumn * Constants_1.Constants.MAP_GAP) - (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2,
                        y: (this._currentRow * Constants_1.Constants.MAP_GAP) - (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2
                    };
                };
                Maze.prototype.eatPellets = function (minx, maxx, miny, maxy) {
                    var _this = this;
                    this._pellets.children.forEach(function (item, index) {
                        if (item.x > minx && item.x < maxx && item.y > miny && item.y < maxy) {
                            _this._pellets.removeChild(item);
                            createjs.Sound.play("chomp", createjs.Sound.INTERRUPT_LATE, null, null, null, .05);
                        }
                    });
                };
                Maze.prototype.blend = function () {
                    var bnd = this.getBounds();
                    this.cache(bnd.x, bnd.y, bnd.width, bnd.height);
                    this.filters = [this.Grayscale];
                    this.updateCache();
                };
                Maze.prototype.unblend = function () {
                    this.filters = [];
                    this.uncache();
                };
                return Maze;
            }(createjs.Container));
            exports_1("Maze", Maze);
        }
    }
});
//# sourceMappingURL=Maze.js.map