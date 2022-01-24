export class Node {
    public f:number;
    public g:number;
    public h:number;
    public pixelX:number;
    public pixelY:number;
    public parent:Node;
    public costMultiplier:number = 1;

    constructor(public x:number, public y:number, public walkable:boolean = true) {

    }
}