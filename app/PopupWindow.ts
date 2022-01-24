import { Constants } from './Constants';

export class PopupWindow extends createjs.Container {
    private _background:createjs.Sprite;
    private _screen:createjs.Sprite;
    private _border:createjs.Sprite;
    private _message:createjs.Sprite;
    private _errorMessageHeader:createjs.Sprite;
    private _errorMessage:createjs.Text;
    private _instMessage:createjs.Text;
    private _instImage:createjs.Sprite;
    private _button:createjs.Sprite;

    private _iMessage:string;

    private _xcentre: number;
    private _ycentre: number;
    private _xerrmsg: number = 120;
    private _yerrmsg: number = 420;

    constructor(private _spritesheet:createjs.SpriteSheet) {
        super();

        this._background = new createjs.Sprite(this._spritesheet, 'assets/answer-window');
        var bnd = this._background.getBounds();
        this._xcentre = this.regX = bnd.width * .5;
        this._ycentre = this.regY = bnd.height * .5;
        this._background.cache(bnd.x, bnd.y, bnd.width, bnd.height);
        this.addChild(this._background);
        
        this._border = new createjs.Sprite(this._spritesheet, 'assets/frame');
        bnd = this._border.getBounds();
        this._border.cache(bnd.x, bnd.y, bnd.width, bnd.height);
        this.addChild(this._border).set({x: 15, y: 17});

        this._message = new createjs.Sprite(this._spritesheet, 'assets/' + Constants.INCORRECT.toLowerCase());
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

        var instImg: string;
        switch(navigator.platform) {
            case "iPhone":
            case "iPod":
            case "iPad":
            case "Android":
                instImg = "assets/instruction-tablet";
                this._iMessage = Constants.INST_MSG_TOUCH;
                break;
            default:
                instImg = 'assets/instruction-desktop';
                this._iMessage = Constants.INST_MSG_DESKTOP;
        }

        this._instImage = new createjs.Sprite(this._spritesheet, instImg);
        this.addChild(this._instImage).set({
            x: this._xcentre, 
            y: 300,
            regX: this._instImage.getBounds().width * .5, 
            regY: this._instImage.getBounds().height * .5
        })
    }

    private closeMessage(e:createjs.Event) {
        var event = new createjs.Event(Constants.CLOSE_WINDOW, false, true);
        event.next = this._message.currentAnimation.toUpperCase().split('/')[1];
        this.dispatchEvent(event);
    }

    public show(value:string, category:number) {
        var cf:createjs.ColorFilter, up:string, hit:string;
        switch(value) {
            case Constants.CORRECT:
                cf = new createjs.ColorFilter(0,0,0,1, 33,198,84,0);
                up = 'assets/next-normal';
                hit = 'assets/next-hit';
                this._button.y = this._button['feedbackY'];
                createjs.Sound.play("correct");
                break;
            case Constants.INCORRECT:
                cf = new createjs.ColorFilter(0,0,0,1, 150,0,0,0);
                up = 'assets/tryagain-normal';
                hit = 'assets/tryagain-hit';
                this._button.y = this._button['feedbackY'];
                createjs.Sound.play("error");
                break;
            case Constants.INSTRUCTIONS:
                cf = new createjs.ColorFilter(0,0,0,1, 4,112,213,0);
                up = 'assets/start-normal';
                hit = 'assets/start-hit';
                this._button.y = this._button['instY'];
                break;
        }
        this._border.filters = [cf];
        this._border.updateCache();

        this._message.gotoAndStop('assets/' + value.toLowerCase());
        this._errorMessageHeader.visible = this._errorMessage.visible = (value == Constants.INCORRECT);
        this._instMessage.visible = this._instImage.visible = (value == Constants.INSTRUCTIONS);
        var bnd = this._message.getBounds();
        this._message.set({
            regX: bnd.width * .5,
            regY: bnd.height * .5,
            y: (value == Constants.INSTRUCTIONS) ? 70 : 100
        });

        if(value == Constants.INCORRECT) {
            this._errorMessage.text = Constants.CATEGORY_LIST.category[category].correct;
        } else if(value == Constants.INSTRUCTIONS) {
            this._instMessage.text = this._iMessage;
        }
        var buttonHelper = new createjs.ButtonHelper(this._button, up, up, hit);
        this._button.on('click', this.closeMessage, this, true);
    }
}