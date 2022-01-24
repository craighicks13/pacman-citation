System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Hero;
    return {
        setters:[],
        execute: function() {
            Hero = (function (_super) {
                __extends(Hero, _super);
                function Hero(spritesheet, frame, _initPos, assetss, thoughtBubble) {
                    _super.call(this);
                    this.initPos = _initPos;
                    this.hero = new createjs.Sprite(spritesheet, frame);
                    var bnd = this.hero.getBounds();
                    this.hero.regX = bnd.width * .5;
                    this.hero.regY = bnd.height * .5;
                    this.addChild(this.hero);
                    this.think = new createjs.Sprite(assetss, thoughtBubble);
                    bnd = this.think.getBounds();
                    this.addChild(this.think).set({
                        x: 3,
                        y: -12,
                        regX: bnd.width * .5,
                        regY: bnd.height,
                        visible: false
                    });
                    this.hero.framerate = 7;
                    this.reset();
                    this.on('tick', this.onTick, this);
                }
                Hero.prototype.reset = function () {
                    this.x = this.currentX = this.initPos.x;
                    this.y = this.currentY = this.initPos.y;
                    this.hero.rotation = 0;
                };
                Hero.prototype.thinking = function (value) {
                    this.think.alpha = 0;
                    this.think.visible = value;
                    return true;
                };
                Hero.prototype.onTick = function (event) {
                    if (this.x > this.currentX) {
                        this.hero.rotation = 0;
                    }
                    else if (this.x < this.currentX) {
                        this.hero.rotation = 180;
                    }
                    if (this.y > this.currentY) {
                        this.hero.rotation = 90;
                    }
                    else if (this.y < this.currentY) {
                        this.hero.rotation = 270;
                    }
                    this.currentX = this.x;
                    this.currentY = this.y;
                };
                return Hero;
            }(createjs.Container));
            exports_1("Hero", Hero);
        }
    }
});
//# sourceMappingURL=Hero.js.map