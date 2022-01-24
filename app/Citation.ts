import { Constants } from './Constants';

export class Citation extends createjs.Container {
    private _title: createjs.Sprite;
    private _container: createjs.Container;
    private _background: createjs.Sprite;
    private _currentRow: number;


    constructor(spritesheet: createjs.SpriteSheet, title: string, background: string) {
        super();
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

    public addPart(value: createjs.Sprite) {
        if(!value) return;
        value.x = value.y = value.rotation = 0;
        if(this._container.numChildren) {
            var last = this._container.getChildAt(this._container.numChildren - 1);
            var nextpos = last.x + last.getBounds().width + 5;
            if(nextpos + value.getBounds().width > this._background.getBounds().width) {
                value.x = 0;
                value.y = last.y + 35;
            } else {
                value.x = nextpos;
                value.y = last.y;
            }
        }
        this._container.addChild(value);
    }

    public isCorrect():boolean {
        var correct:boolean = true;
        this._container.children.forEach((item:createjs.Sprite, index) => {
            if(item['order'] != index) correct = false;
        });
        return correct;
    }

    public clear() {
        this._container.removeAllChildren();
        this._currentRow = 0;
    }
}