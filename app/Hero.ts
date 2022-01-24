export class Hero extends createjs.Container {
    private currentX: number;
    private currentY: number;
    private initPos: any;
    private hero:createjs.Sprite;
    public think:createjs.Sprite;

    constructor(spritesheet: createjs.SpriteSheet, frame: string, _initPos:any, assetss:createjs.SpriteSheet, thoughtBubble:string) {
        super();

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

    public reset() {
        this.x = this.currentX = this.initPos.x;
        this.y = this.currentY = this.initPos.y;
        this.hero.rotation = 0;
    }

    public thinking(value:boolean):boolean {
        this.think.alpha = 0;
        this.think.visible = value;
        return true;
    }

    private onTick(event: createjs.Event) {
        if(this.x > this.currentX) {
            this.hero.rotation = 0;
        } else if(this.x < this.currentX) {
            this.hero.rotation = 180;
        }

        if(this.y > this.currentY) {
            this.hero.rotation = 90;
        } else if(this.y < this.currentY) {
            this.hero.rotation = 270;
        }

        this.currentX = this.x;
        this.currentY = this.y;
    }
}