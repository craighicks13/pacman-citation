System.register(['./AssetsManager', './Constants', './Hero', './Maze', './UserInterface', './Pathfinder', './Lesson', './Citation', './PopupWindow'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AssetsManager_1, Constants_1, Constants_2, Constants_3, Hero_1, Maze_1, UserInterface_1, Pathfinder_1, Lesson_1, Citation_1, PopupWindow_1;
    var Game;
    return {
        setters:[
            function (AssetsManager_1_1) {
                AssetsManager_1 = AssetsManager_1_1;
            },
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
                Constants_2 = Constants_1_1;
                Constants_3 = Constants_1_1;
            },
            function (Hero_1_1) {
                Hero_1 = Hero_1_1;
            },
            function (Maze_1_1) {
                Maze_1 = Maze_1_1;
            },
            function (UserInterface_1_1) {
                UserInterface_1 = UserInterface_1_1;
            },
            function (Pathfinder_1_1) {
                Pathfinder_1 = Pathfinder_1_1;
            },
            function (Lesson_1_1) {
                Lesson_1 = Lesson_1_1;
            },
            function (Citation_1_1) {
                Citation_1 = Citation_1_1;
            },
            function (PopupWindow_1_1) {
                PopupWindow_1 = PopupWindow_1_1;
            }],
        execute: function() {
            Game = (function () {
                function Game(manifest) {
                    this.category = Constants_3.Category.WEBSITE;
                    this.direction = Constants_2.Direction.NONE;
                    this.next_direction = Constants_2.Direction.NONE;
                    this.speed = 5;
                    this.heroStartPosition = { x: 11.5, y: 11 };
                    this.checkingResults = false;
                    this.autorun = false;
                    this.autorunInterupt = false;
                    this.touchIsEnabled = false;
                    this.touchDragDistance = 30;
                    // create stage and point it to the canvas:
                    this.canvas = document.getElementById("canvas");
                    //check to see if we are running in a browser with touch support
                    this.stage = new createjs.Stage(this.canvas);
                    this.stage.autoClear = true;
                    // enable touch interactions if supported on the current device:
                    if (createjs.Touch.isSupported()) {
                        this.touchIsEnabled = createjs.Touch.enable(this.stage);
                    }
                    // enabled mouse over / out events
                    this.stage.enableMouseOver(5);
                    // tick evvent
                    createjs.Ticker.setFPS(40);
                    this.container = new createjs.Container();
                    this.stage.addChild(this.container);
                    this.overlay = new createjs.Container();
                    this.stage.addChild(this.overlay);
                    // create assetManagerObject as a container to display label and deal with the queueManager
                    this.assets = new AssetsManager_1.AssetsManager(manifest);
                    this.assets.on(Constants_1.Constants.LOAD_COMPLETE, this.allAssetsLoaded, this, true);
                    this.assets.startDownLoad();
                }
                Game.prototype.allAssetsLoaded = function (event) {
                    event.stopImmediatePropagation();
                    this.gameboard = new Maze_1.Maze();
                    this.gameboard.on(Constants_1.Constants.MAZE_LOADED, this.buildGameBoard, this, true);
                    this.container.addChild(this.gameboard);
                    this.gameboard.setMaze(this.assets.getItemById('maze'), this.category);
                    this.gameboard.initPellets(this.assets.getItemById('pellet'));
                };
                Game.prototype.buildGameBoard = function (e) {
                    this.lesson = new Lesson_1.Lesson();
                    this.lesson.on(Constants_1.Constants.AUTO_RUN, this.onAutoRun, this);
                    this.lesson.on(Constants_1.Constants.PART_COLLECTED, this.onPartCollected, this);
                    this.gameboard.addChild(this.lesson);
                    this.addLessonInfo();
                    this.citation = new Citation_1.Citation(this.assets.getItemById('iAssets'), "assets/citation_title", "assets/citation-box");
                    this.citation.y = this.gameboard.y + this.gameboard.mazeHeight() + Constants_1.Constants.MAP_BORDER;
                    this.container.addChild(this.citation);
                    this.hero = new Hero_1.Hero(this.assets.getItemById('pacman'), 'pacman', {
                        x: (this.heroStartPosition.x - 1) * Constants_1.Constants.MAP_GAP + Constants_1.Constants.MAP_BORDER + Constants_1.Constants.MAP_GAP / 2,
                        y: ((this.heroStartPosition.y - 1) * Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2
                    }, this.assets.getItemById('iAssets'), 'assets/thinking');
                    this.gameboard.addChild(this.hero);
                    this.currentGrid = this.gameboard.getCurrentGrid(this.heroStartPosition.x, this.heroStartPosition.y);
                    this.ui = new UserInterface_1.UserInterface();
                    this.ui.build(this.assets.getItemById('iAssets'), "assets/instruction-normal", "assets/reset-normal");
                    this.ui.on(Constants_1.Constants.INSTRUCTIONS, this.onShowInstructions, this);
                    this.ui.on(Constants_1.Constants.RESET, this.resetCategory, this);
                    this.gameboard.addChild(this.ui).set({
                        x: this.gameboard.getBounds().width * .5 - this.ui.getBounds().width * .5,
                        y: 300
                    });
                    this.createPopupWindow();
                    createjs.Ticker.on("tick", this.tick, this);
                    if (this.touchIsEnabled) {
                        this.stage.on('stagemousedown', this.onTouchBoard, this, true);
                    }
                    window.addEventListener('keydown', this.keypress.bind(this));
                    this.onShowInstructions(null);
                    createjs.Sound.play("intro");
                };
                Game.prototype.onTouchBoard = function (e) {
                    this.touchDownPosition = { x: e.stageX, y: e.stageY };
                    this.stage.on('stagemousemove', this.onTouchMove, this);
                    this.stage.on('stagemouseup', this.onReleaseBoard, this, true);
                };
                Game.prototype.onReleaseBoard = function (e) {
                    this.stage.removeAllEventListeners('stagemousemove');
                    this.stage.on('stagemousedown', this.onTouchBoard, this, true);
                };
                Game.prototype.onTouchMove = function (e) {
                    var xDiff = e.stageX - this.touchDownPosition.x;
                    var yDiff = e.stageY - this.touchDownPosition.y;
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > this.touchDragDistance) {
                            this.next_direction = Constants_2.Direction.RIGHT;
                            this.touchDownPosition = { x: e.stageX, y: e.stageY };
                        }
                        else if (xDiff < -this.touchDragDistance) {
                            this.next_direction = Constants_2.Direction.LEFT;
                            this.touchDownPosition = { x: e.stageX, y: e.stageY };
                        }
                    }
                    else {
                        if (yDiff > this.touchDragDistance) {
                            this.next_direction = Constants_2.Direction.DOWN;
                            this.touchDownPosition = { x: e.stageX, y: e.stageY };
                        }
                        else if (yDiff < -this.touchDragDistance) {
                            this.next_direction = Constants_2.Direction.UP;
                            this.touchDownPosition = { x: e.stageX, y: e.stageY };
                        }
                    }
                };
                Game.prototype.onAutoRun = function (e) {
                    this.hero.thinking(true);
                    createjs.Tween.get(this.hero.think).to({ alpha: 1 }, 100).wait(200).call(this.findPath, [e.node], this);
                    //this.doPathFinder = e.node;
                };
                Game.prototype.findPath = function (node) {
                    this.pathfinder = new Pathfinder_1.Pathfinder();
                    this.gameboard.setStartNode(this.currentGrid.column - 1, this.currentGrid.row - 1);
                    this.gameboard.setEndNode(Math.round(node.location.column - 1), Math.round(node.location.row - 1));
                    this.gameboard.updateNodeCosts(this.lesson, node.id);
                    this.doPathFinder = null;
                    if (this.pathfinder.findPath(this.gameboard)) {
                        this.nextGrid = null;
                        this.autorun = true;
                        this.hero.thinking(false);
                    }
                };
                Game.prototype.onPartCollected = function (e) {
                    this.autorunInterupt = true;
                };
                Game.prototype.drawBlock = function (value) {
                    var b = new createjs.Shape();
                    b.graphics.beginFill("#FF0000");
                    b.graphics.drawRect(0, 0, 20, 20);
                    b.regX = b.regY = 10;
                    this.overlay.addChild(b).set(value);
                };
                Game.prototype.createPopupWindow = function () {
                    if (this.popup)
                        return this.popup;
                    this.popup = new PopupWindow_1.PopupWindow(this.assets.getItemById('iAssets'));
                    this.popup.on(Constants_1.Constants.CLOSE_WINDOW, this.closePopupWindow, this);
                    this.popup.x = this.gameboard.mazeWidth() * .5;
                    this.popup.y = this.gameboard.mazeHeight() * .5;
                    return this.popup;
                };
                Game.prototype.showPopupWindow = function (value) {
                    this.popup.show(value, this.category);
                    this.overlay.addChild(this.popup);
                    this.gameboard.blend();
                };
                Game.prototype.closePopupWindow = function (e) {
                    e.stopImmediatePropagation();
                    this.overlay.removeChild(this.popup);
                    this.gameboard.unblend();
                    switch (e.next) {
                        case Constants_1.Constants.CORRECT:
                            this.nextCategory();
                            break;
                        case Constants_1.Constants.INCORRECT:
                            this.resetCategory();
                            break;
                        case Constants_1.Constants.INSTRUCTIONS:
                        default:
                            break;
                    }
                };
                Game.prototype.checkCitation = function () {
                    this.checkingResults = true;
                    this.showPopupWindow(this.citation.isCorrect() ? Constants_1.Constants.CORRECT : Constants_1.Constants.INCORRECT);
                };
                Game.prototype.resetCategory = function () {
                    this.checkingResults = false;
                    this.lesson.clearParts();
                    this.hero.reset();
                    this.next_direction = this.direction = Constants_2.Direction.NONE;
                    this.addLessonInfo();
                    this.citation.clear();
                    this.gameboard.initPellets(this.assets.getItemById('pellet'));
                    this.gameboard.updateMazeColor(this.category);
                    this.autorunInterupt = this.autorun = false;
                };
                Game.prototype.nextCategory = function () {
                    this.checkingResults = false;
                    this.lesson.clearParts();
                    this.category++;
                    if (this.category == 4)
                        this.category = 0;
                    this.hero.reset();
                    this.next_direction = this.direction = Constants_2.Direction.NONE;
                    this.addLessonInfo();
                    this.citation.clear();
                    this.gameboard.initPellets(this.assets.getItemById('pellet'));
                    this.gameboard.updateMazeColor(this.category);
                    this.autorunInterupt = this.autorun = false;
                };
                Game.prototype.addLessonInfo = function () {
                    this.lesson.setTitle(this.assets.getItemById('iAssets'), 'assets/' + Constants_1.Constants.CATEGORY_LIST.category[this.category].title);
                    var list = Constants_1.Constants.CATEGORY_LIST.category[this.category].parts;
                    for (var n = 0; n < list.length; n++) {
                        this.lesson.addPart(this.assets.getItemById('iAssets'), list[n], n);
                    }
                    ;
                };
                Game.prototype.onShowInstructions = function (e) {
                    if (this.container.contains(this.popup))
                        return;
                    this.showPopupWindow(Constants_1.Constants.INSTRUCTIONS);
                };
                Game.prototype.keypress = function (e) {
                    if (this.checkingResults)
                        return;
                    if (this.autorun)
                        this.autorunInterupt = this.autorun = false;
                    switch (e.keyCode) {
                        case 38:
                            this.next_direction = Constants_2.Direction.UP;
                            break;
                        case 39:
                            this.next_direction = Constants_2.Direction.RIGHT;
                            break;
                        case 37:
                            this.next_direction = Constants_2.Direction.LEFT;
                            break;
                        case 40:
                            this.next_direction = Constants_2.Direction.DOWN;
                            break;
                        case 82:
                            this.resetCategory();
                            break;
                        case 67:
                            if (e.shiftKey)
                                this.nextCategory();
                            break;
                        case 73:
                            this.onShowInstructions(null);
                            break;
                        case 80:
                            if (this.container.contains(this.popup))
                                return;
                            this.showPopupWindow(e.shiftKey ? Constants_1.Constants.CORRECT : Constants_1.Constants.INCORRECT);
                            break;
                    }
                    if (this.direction == Constants_2.Direction.NONE) {
                        this.direction = this.next_direction;
                        this.next_direction = Constants_2.Direction.NONE;
                    }
                };
                Game.prototype.autoRunTick = function () {
                    if (!this.nextGrid || (Math.abs(this.hero.y - this.nextGrid.y) < this.speed && Math.abs(this.hero.x - this.nextGrid.x) < this.speed)) {
                        if (this.nextGrid) {
                            this.hero.x = this.nextGrid.x;
                            this.hero.y = this.nextGrid.y;
                            if (this.autorunInterupt) {
                                this.autorunInterupt = this.autorun = false;
                            }
                        }
                        if (!this.pathfinder.path.length) {
                            this.autorunInterupt = this.autorun = false;
                            this.nextGrid = null;
                        }
                        else {
                            var node = this.pathfinder.path.shift();
                            this.nextGrid = this.gameboard.getGridLocation({ column: node.x, row: node.y });
                        }
                    }
                    if (!this.nextGrid)
                        return;
                    if (this.hero.x > this.nextGrid.x)
                        this.hero.x -= this.speed;
                    else if (this.hero.x < this.nextGrid.x)
                        this.hero.x += this.speed;
                    else if (this.hero.y > this.nextGrid.y)
                        this.hero.y -= this.speed;
                    else if (this.hero.y < this.nextGrid.y)
                        this.hero.y += this.speed;
                };
                Game.prototype.tick = function (e) {
                    this.stage.update(e);
                    if (this.checkingResults)
                        return;
                    this.gameboard.eatPellets(this.hero.x - 15, this.hero.x + 15, this.hero.y - 15, this.hero.y + 15);
                    this.currentGrid = this.gameboard.getCurrentGrid(this.hero.x, this.hero.y);
                    this.citation.addPart(this.lesson.eatPart(this.hero));
                    if (!this.lesson.hasParts() && !this.checkingResults)
                        this.checkCitation();
                    if (this.gameboard.nextBlock(this.next_direction)) {
                        if ((this.next_direction > 2 && Math.abs(this.hero.y - this.currentGrid.y) < this.speed) ||
                            (this.next_direction < 3 && Math.abs(this.hero.x - this.currentGrid.x) < this.speed)) {
                            this.direction = this.next_direction;
                            this.next_direction = Constants_2.Direction.NONE;
                        }
                    }
                    switch (this.direction) {
                        case Constants_2.Direction.UP:
                            this.hero.x = this.currentGrid.x;
                            if (!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.y - this.currentGrid.y) < this.speed) {
                                this.hero.y = this.currentGrid.y;
                                this.direction = Constants_2.Direction.NONE;
                            }
                            else {
                                this.hero.y -= this.speed;
                            }
                            break;
                        case Constants_2.Direction.RIGHT:
                            this.hero.y = this.currentGrid.y;
                            if (!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.x - this.currentGrid.x) < this.speed) {
                                this.hero.x = this.currentGrid.x;
                                this.direction = Constants_2.Direction.NONE;
                            }
                            else {
                                this.hero.x += this.speed;
                            }
                            break;
                        case Constants_2.Direction.LEFT:
                            this.hero.y = this.currentGrid.y;
                            if (!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.x - this.currentGrid.x) < this.speed) {
                                this.hero.x = this.currentGrid.x;
                                this.direction = Constants_2.Direction.NONE;
                            }
                            else {
                                this.hero.x -= this.speed;
                            }
                            break;
                        case Constants_2.Direction.DOWN:
                            this.hero.x = this.currentGrid.x;
                            if (!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.y - this.currentGrid.y) < this.speed) {
                                this.hero.y = this.currentGrid.y;
                                this.direction = Constants_2.Direction.NONE;
                            }
                            else {
                                this.hero.y += this.speed;
                            }
                            break;
                        case Constants_2.Direction.NONE:
                            break;
                    }
                    if (this.autorun)
                        this.autoRunTick();
                };
                return Game;
            }());
            exports_1("Game", Game);
        }
    }
});
//# sourceMappingURL=Game.js.map