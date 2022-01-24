import { Maze } from './Maze';
import { Node } from './Node';

export class Pathfinder {
    private _open:any[];
    private _closed:any[];
    private _grid:Maze;
    private _endNode:Node;
    private _startNode:Node;
    private _path:any[];
    private _heuristic:Function = this.manhattan;
    //private _heuristic:Function = this.eulidian;
    //private _heuristic:Function = this.diagonal;
    private _straightCost:number = 1.0;
    private _diagCost:number = Math.SQRT2 * 10;

    constructor() {

    }

    public findPath(grid:Maze):boolean {
        this._grid = grid;
        this._open = [];
        this._closed = [];
        this._startNode = this._grid.startNode;
        this._endNode = this._grid.endNode;
        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;

        return this.search();
    }

    public search():boolean {
        let node:Node = this._startNode;
        while(node != this._endNode) {
            let startX:number = Math.max(0, node.x - 1);
            let endX:number = Math.min(this._grid.numCols - 1, node.x + 1);
            let startY:number = Math.max(0, node.y - 1);
            let endY:number = Math.min(this._grid.numRows - 1, node.y + 1);

            for(var i:number = startX; i <= endX; i++) {
                for(var j:number = startY; j <= endY; j++) {
                    let test:Node = this._grid.getNode(i, j);
                    if(test == node || !test.walkable) continue;

                    var cost:number = this._straightCost;
                    if(!((node.x == test.x) || (node.y == test.y))){
                        cost = this._diagCost;
                    }
                    let g:number = node.g + (cost * test.costMultiplier);
                    let h:number = this._heuristic(test);
                    let f:number = g + h;
                    if(this.isOpen(test) || this.isClosed(test)) {
                        if(test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                        }
                    } else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.push(test);
                    }
                }
            }
            this._closed.push(node);
            if(this._open.length == 0) {
                console.log("no path found");
                return false;
            }
            this._open.sort((a, b):number => {
                if(a.f < b.f) return -1;
                if(a.f > b.f) return 1;
                return 0;
            });
            node = this._open.shift();
        }
        this.buildPath();
        return true;
    }

    private buildPath() {
        this._path = [];
        var node:Node = this._endNode;
        this._path.push(node);
        while(node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    }

    public get path():any[] {
        return this._path;
    }

    private isOpen(node:Node):boolean {
        for(var i:number = 0; i < this._open.length; i++) {
            if(this._open[i] == node) {
                return true;
            }
        }
        return false;
    }

    private isClosed(node:Node):boolean {
        for(var i:number = 0; i < this._closed.length; i++) {
            if(this._closed[i] == node) {
                return true;
            }
        }
        return false;
    }

    private manhattan(node:Node):number {
        return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
    }

    private eulidian(node:Node):number {
        var dx:number = node.x - this._endNode.x;
        var dy:number = node.y - this._endNode.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    }

    private diagonal(node:Node):number {
        var dx:number = Math.abs(node.x - this._endNode.x);
        var dy:number = Math.abs(node.y - this._endNode.y);
        var diag:number = Math.min(dx, dy);
        var straight:number = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    }

    public get visited():any[] {
        return this._closed.concat(this._open);
    }
}