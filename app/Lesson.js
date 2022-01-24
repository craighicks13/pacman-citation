System.register(['./Constants', './Snippet', './LocateNode'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Constants_1, Snippet_1, LocateNode_1;
    var Lesson;
    return {
        setters:[
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            },
            function (Snippet_1_1) {
                Snippet_1 = Snippet_1_1;
            },
            function (LocateNode_1_1) {
                LocateNode_1 = LocateNode_1_1;
            }],
        execute: function() {
            Lesson = (function (_super) {
                __extends(Lesson, _super);
                function Lesson() {
                    _super.call(this);
                    this.parts = [];
                    this.mouseEnabled = true;
                }
                Lesson.prototype.setTitle = function (spritesheet, frame) {
                    this.title = new createjs.Sprite(spritesheet, frame);
                    this.title.regX = this.title.getBounds().width * .5;
                    this.title.regY = this.title.getBounds().height * .5;
                    this.title.x = 456;
                    this.title.y = 220;
                    this.addChild(this.title);
                };
                Lesson.prototype.addPart = function (spritesheet, info, order) {
                    var part = new Snippet_1.Snippet(spritesheet, info.name);
                    var pw = part.getBounds().width;
                    //part.regX = pw * .5;
                    part.regY = part.getBounds().height * .5;
                    if (info.rotation)
                        part.rotation = info.rotation;
                    part.x = (info.col - 1) * Constants_1.Constants.MAP_GAP + Constants_1.Constants.MAP_BORDER + Constants_1.Constants.MAP_GAP / 2;
                    part.y = ((info.row - 1) * Constants_1.Constants.MAP_GAP) + (Constants_1.Constants.MAP_GAP * .5) + Constants_1.Constants.MAP_BORDER + 2;
                    part.order = order;
                    part.location = { row: info.row, column: info.col };
                    part.on('click', this.onPartClicked, this);
                    this.addChild(part);
                    this.parts.push(part);
                    return true;
                };
                Lesson.prototype.eatPart = function (hero) {
                    var _this = this;
                    var p;
                    this.parts.forEach(function (item, index) {
                        var pt = item.globalToLocal(hero.x, hero.y);
                        if (item.hitTest(pt.x, pt.y)) {
                            _this.removeChild(item);
                            _this.parts.splice(index, 1);
                            p = item;
                            createjs.Sound.play("snippet");
                            _this.dispatchEvent(Constants_1.Constants.PART_COLLECTED);
                            return;
                        }
                        return;
                    });
                    return p;
                };
                Lesson.prototype.checkWalkable = function (nodeX, nodeY, id) {
                    var hit = false;
                    this.parts.forEach(function (item, index) {
                        var pt = item.globalToLocal(nodeX, nodeY);
                        if (item.order != id && item.hitTest(pt.x, pt.y)) {
                            hit = true;
                            return;
                        }
                    });
                    return hit;
                };
                Lesson.prototype.clearParts = function () {
                    this.removeAllChildren();
                    this.parts = [];
                };
                Lesson.prototype.hasParts = function () {
                    return this.parts.length > 0;
                };
                Lesson.prototype.onPartClicked = function (e) {
                    var event = new createjs.Event(Constants_1.Constants.AUTO_RUN, false, true);
                    var ln = new LocateNode_1.LocateNode();
                    ln.location = e.currentTarget.location;
                    ln.id = e.currentTarget.order;
                    event["node"] = ln;
                    this.dispatchEvent(event);
                };
                return Lesson;
            }(createjs.Container));
            exports_1("Lesson", Lesson);
        }
    }
});
//# sourceMappingURL=Lesson.js.map