System.register(['./Constants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Constants_1;
    var UserInterface;
    return {
        setters:[
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            }],
        execute: function() {
            UserInterface = (function (_super) {
                __extends(UserInterface, _super);
                function UserInterface() {
                    _super.call(this);
                }
                UserInterface.prototype.build = function (spritesheet, info, reset) {
                    this._infoBtn = new createjs.Sprite(spritesheet, info);
                    this._infoBtn.on('click', this.onInfoClicked, this);
                    this._infoBtn.cursor = 'pointer';
                    this.addChild(this._infoBtn).set({ x: 75 });
                    this._resetBtn = new createjs.Sprite(spritesheet, reset);
                    this._resetBtn.on('click', this.onResetClicked, this);
                    this._resetBtn.cursor = 'pointer';
                    this.addChild(this._resetBtn);
                    var r = this._infoBtn.getBounds().width * .5;
                    var hitArea = new createjs.Shape(new createjs.Graphics().f("green").dc(r, r, r));
                    var iHover = info.split('-')[0] + '-hover';
                    var rHover = reset.split('-')[0] + '-hover';
                    new createjs.ButtonHelper(this._infoBtn, info, iHover, iHover, false, hitArea);
                    new createjs.ButtonHelper(this._resetBtn, reset, rHover, rHover, false, hitArea);
                };
                UserInterface.prototype.onInfoClicked = function (e) {
                    e.stopImmediatePropagation();
                    this.dispatchEvent(Constants_1.Constants.INSTRUCTIONS);
                };
                UserInterface.prototype.onResetClicked = function (e) {
                    e.stopImmediatePropagation();
                    this.dispatchEvent(Constants_1.Constants.RESET);
                };
                return UserInterface;
            }(createjs.Container));
            exports_1("UserInterface", UserInterface);
        }
    }
});
//# sourceMappingURL=UserInterface.js.map