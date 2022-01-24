export class Snippet extends createjs.Sprite {
    public order: number;
    public location: any;
    private initPos: any;

   constructor(spritesheet: createjs.SpriteSheet, frame: string) {
        super(spritesheet, frame);
        this.mouseEnabled = true;
        this.cursor = 'pointer';
    }
}