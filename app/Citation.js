System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Citation;
    return {
        setters:[],
        execute: function() {
            Citation = (function (_super) {
                __extends(Citation, _super);
                function Citation(spritesheet, title, background) {
                    _super.call(this);
                    this.mouseChildren = false;
                    this._title = new createjs.Sprite(spritesheet, title);
                    this._title.x = 15;
                    this.addChild(this._title);
                    this._background = new createjs.Sprite(spritesheet, background);
                    this._background.y = this._title.getBounds().height + 10;
                    this.addChild(this._background);
                    this._container = new createjs.Container();
                    this._container.x = this._title.x;
                    this._container.y = this._background.y + 25;
                    this.addChild(this._container);
                }
                Citation.prototype.addPart = function (value) {
                    if (!value)
                        return;
                    value.x = value.y = value.rotation = 0;
                    if (this._container.numChildren) {
                        var last = this._container.getChildAt(this._container.numChildren - 1);
                        var nextpos = last.x + last.getBounds().width + 5;
                        if (nextpos + value.getBounds().width > this._background.getBounds().width) {
                            value.x = 0;
                            value.y = last.y + 35;
                        }
                        else {
                            value.x = nextpos;
                            value.y = last.y;
                        }
                    }
                    this._container.addChild(value);
                };
                Citation.prototype.isCorrect = function () {
                    var correct = true;
                    this._container.children.forEach(function (item, index) {
                        if (item['order'] != index)
                            correct = false;
                    });
                    return correct;
                };
                Citation.prototype.clear = function () {
                    this._container.removeAllChildren();
                    this._currentRow = 0;
                };
                return Citation;
            }(createjs.Container));
            exports_1("Citation", Citation);
        }
    }
});
//# sourceMappingURL=Citation.js.map