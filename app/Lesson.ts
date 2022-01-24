import { Constants } from './Constants';
import { Category } from './Constants';
import { AssetsManager } from './AssetsManager';
import { Snippet } from './Snippet';
import { Hero } from './Hero';
import { LocateNode } from './LocateNode';


export class Lesson extends createjs.Container {
    private title: createjs.Sprite;
    private parts: any[] = [];

    constructor() {
        super();
        this.mouseEnabled = true;
    }

    public setTitle(spritesheet, frame) {
        this.title = new createjs.Sprite(spritesheet, frame);
        this.title.regX = this.title.getBounds().width * .5;
        this.title.regY = this.title.getBounds().height * .5;
        this.title.x = 456;
        this.title.y = 220;
        this.addChild(this.title);
    }

    public addPart(spritesheet, info, order):boolean {
        var part:Snippet = new Snippet(spritesheet, info.name);
        var pw:number = part.getBounds().width;
        //part.regX = pw * .5;
        part.regY = part.getBounds().height * .5;
        if(info.rotation) part.rotation = info.rotation;
        part.x = (info.col - 1) * Constants.MAP_GAP  + Constants.MAP_BORDER + Constants.MAP_GAP/2;
        part.y = ((info.row - 1) * Constants.MAP_GAP) + (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2;
        part.order = order;
        part.location = {row: info.row, column: info.col};
        part.on('click', this.onPartClicked, this);
        this.addChild(part);

        this.parts.push(part);

        return true;
    }

    public eatPart(hero:Hero):createjs.Sprite {
        var p:createjs.Sprite;
        this.parts.forEach((item:createjs.Sprite, index:number) => {
            var pt = item.globalToLocal(hero.x, hero.y);
            if(item.hitTest(pt.x, pt.y)) {
                this.removeChild(item);
                this.parts.splice(index, 1);
                p = item;
                createjs.Sound.play("snippet");
                this.dispatchEvent(Constants.PART_COLLECTED);
                return;
            }
            return;
        })
        return p;
    }

    public checkWalkable(nodeX:number, nodeY:number, id:number):boolean {
        var hit:boolean = false;
        this.parts.forEach((item:Snippet, index:number) => {
            var pt = item.globalToLocal(nodeX, nodeY);
            if(item.order != id && item.hitTest(pt.x, pt.y)) {
                hit = true;
                return;
            }
        })
        return hit;
    }

    public clearParts() {
        this.removeAllChildren();
        this.parts = [];
    }

    public hasParts():boolean {
        return this.parts.length > 0;
    }

    private onPartClicked(e:createjs.Event) {
        var event:createjs.Event = new createjs.Event(Constants.AUTO_RUN, false, true);
        var ln:LocateNode = new LocateNode();
        ln.location = e.currentTarget.location;
        ln.id = e.currentTarget.order;
        event["node"] = ln;
        this.dispatchEvent(event);
    }

}