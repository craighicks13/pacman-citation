import { Constants } from './Constants';

export class UserInterface extends createjs.Container {
    private _infoBtn:createjs.Sprite;
    private _resetBtn:createjs.Sprite;

    constructor() {
        super();
    }

    public build(spritesheet:createjs.SpriteSheet, info:string, reset:string) {
        this._infoBtn = new createjs.Sprite(spritesheet, info);
        this._infoBtn.on('click', this.onInfoClicked, this);
        this._infoBtn.cursor = 'pointer';
        this.addChild(this._infoBtn).set({x: 75});
        this._resetBtn = new createjs.Sprite(spritesheet, reset);
        this._resetBtn.on('click', this.onResetClicked, this);
        this._resetBtn.cursor = 'pointer';
        this.addChild(this._resetBtn);

        var r:number = this._infoBtn.getBounds().width * .5
        var hitArea:createjs.Shape = new createjs.Shape(new createjs.Graphics().f("green").dc(r, r, r));

        var iHover:string = info.split('-')[0] + '-hover';
        var rHover:string = reset.split('-')[0] + '-hover';
        new createjs.ButtonHelper(this._infoBtn, info, iHover, iHover, false, hitArea);
        new createjs.ButtonHelper(this._resetBtn, reset, rHover, rHover, false, hitArea);
    }

    private onInfoClicked(e:createjs.Event){
        e.stopImmediatePropagation();
        this.dispatchEvent(Constants.INSTRUCTIONS);
    }

    private onResetClicked(e:createjs.Event) {
        e.stopImmediatePropagation();
        this.dispatchEvent(Constants.RESET);
    }
}