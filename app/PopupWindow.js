System.register(['./Constants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Constants_1;
    var PopupWindow;
    return {
        setters:[
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            }],
        execute: function() {
            PopupWindow = (function (_super) {
                __extends(PopupWindow, _super);
                function PopupWindow(_spritesheet) {
                    _super.call(this);
                    this._spritesheet = _spritesheet;
                    this._xerrmsg = 120;
                    this._yerrmsg = 420;
                    this._background = new createjs.Sprite(this._spritesheet, 'assets/answer-window');
                    var bnd = this._background.getBounds();
                    this._xcentre = this.regX = bnd.width * .5;
                    this._ycentre = this.regY = bnd.height * .5;
                    this._background.cache(bnd.x, bnd.y, bnd.width, bnd.height);
                    this.addChild(this._background);
                    this._border = new createjs.Sprite(this._spritesheet, 'assets/frame');
                    bnd = this._border.getBounds();
                    this._border.cache(bnd.x, bnd.y, bnd.width, bnd.height);
                    this.addChild(this._border).set({ x: 15, y: 17 });
                    this._message = new createjs.Sprite(this._spritesheet, 'assets/' + Constants_1.Constants.INCORRECT.toLowerCase());
                    bnd = this._message.getBounds();
                    this.addChild(this._message).set({
                        regX: bnd.width * .5,
                        regY: bnd.height * .5,
                        x: this._xcentre,
                        y: 100
                    });
                    this._button = new createjs.Sprite(this._spritesheet, 'assets/next-normal');
                    this._button['feedbackY'] = this._message.y + bnd.height + 180;
                    this._button['instY'] = this._message.y + bnd.height + 320;
                    this.addChild(this._button).set({
                        x: this._xcentre,
                        y: this._button['feedbackY'],
                        regX: this._button.getBounds().width * .5,
                        regY: this._button.getBounds().height * .5
                    });
                    this._errorMessageHeader = new createjs.Sprite(this._spritesheet, 'assets/correctis');
                    this.addChild(this._errorMessageHeader).set({
                        x: this._xerrmsg,
                        y: this._yerrmsg
                    });
                    this._errorMessage = new createjs.Text('', "bold 14px Whitney", "#060606");
                    this._errorMessage.lineWidth = 700;
                    this._errorMessage.lineHeight = 20;
                    this.addChild(this._errorMessage).set({
                        x: this._xerrmsg,
                        y: this._yerrmsg + 20
                    });
                    this._instMessage = new createjs.Text('', "bold 20px Whitney", "#060606");
                    this._instMessage.lineWidth = 650;
                    this._instMessage.lineHeight = 30;
                    this._instMessage.textAlign = 'center';
                    this.addChild(this._instMessage).set({
                        x: this._xcentre,
                        y: 120
                    });
                    var instImg;
                    switch (navigator.platform) {
                        case "iPhone":
                        case "iPod":
                        case "iPad":
                        case "Android":
                            instImg = "assets/instruction-tablet";
                            this._iMessage = Constants_1.Constants.INST_MSG_TOUCH;
                            break;
                        default:
                            instImg = 'assets/instruction-desktop';
                            this._iMessage = Constants_1.Constants.INST_MSG_DESKTOP;
                    }
                    this._instImage = new createjs.Sprite(this._spritesheet, instImg);
                    this.addChild(this._instImage).set({
                        x: this._xcentre,
                        y: 300,
                        regX: this._instImage.getBounds().width * .5,
                        regY: this._instImage.getBounds().height * .5
                    });
                }
                PopupWindow.prototype.closeMessage = function (e) {
                    var event = new createjs.Event(Constants_1.Constants.CLOSE_WINDOW, false, true);
                    event.next = this._message.currentAnimation.toUpperCase().split('/')[1];
                    this.dispatchEvent(event);
                };
                PopupWindow.prototype.show = function (value, category) {
                    var cf, up, hit;
                    switch (value) {
                        case Constants_1.Constants.CORRECT:
                            cf = new createjs.ColorFilter(0, 0, 0, 1, 33, 198, 84, 0);
                            up = 'assets/next-normal';
                            hit = 'assets/next-hit';
                            this._button.y = this._button['feedbackY'];
                            createjs.Sound.play("correct");
                            break;
                        case Constants_1.Constants.INCORRECT:
                            cf = new createjs.ColorFilter(0, 0, 0, 1, 150, 0, 0, 0);
                            up = 'assets/tryagain-normal';
                            hit = 'assets/tryagain-hit';
                            this._button.y = this._button['feedbackY'];
                            createjs.Sound.play("error");
                            break;
                        case Constants_1.Constants.INSTRUCTIONS:
                            cf = new createjs.ColorFilter(0, 0, 0, 1, 4, 112, 213, 0);
                            up = 'assets/start-normal';
                            hit = 'assets/start-hit';
                            this._button.y = this._button['instY'];
                            break;
                    }
                    this._border.filters = [cf];
                    this._border.updateCache();
                    this._message.gotoAndStop('assets/' + value.toLowerCase());
                    this._errorMessageHeader.visible = this._errorMessage.visible = (value == Constants_1.Constants.INCORRECT);
                    this._instMessage.visible = this._instImage.visible = (value == Constants_1.Constants.INSTRUCTIONS);
                    var bnd = this._message.getBounds();
                    this._message.set({
                        regX: bnd.width * .5,
                        regY: bnd.height * .5,
                        y: (value == Constants_1.Constants.INSTRUCTIONS) ? 70 : 100
                    });
                    if (value == Constants_1.Constants.INCORRECT) {
                        this._errorMessage.text = Constants_1.Constants.CATEGORY_LIST.category[category].correct;
                    }
                    else if (value == Constants_1.Constants.INSTRUCTIONS) {
                        this._instMessage.text = this._iMessage;
                    }
                    var buttonHelper = new createjs.ButtonHelper(this._button, up, up, hit);
                    this._button.on('click', this.closeMessage, this, true);
                };
                return PopupWindow;
            }(createjs.Container));
            exports_1("PopupWindow", PopupWindow);
        }
    }
});
//# sourceMappingURL=PopupWindow.js.map