import { Constants } from './Constants';
import { Direction } from './Constants';
import { ICurrentGrid } from './interfaces/ICurrentGrid';
import { Node } from './Node';
import { Lesson } from './Lesson'

export class Maze extends createjs.Container {

    private _maze:createjs.Bitmap;
    private _pellets:createjs.Container;
    private _currentColumn: number;
    private _currentRow: number;
    private _gridWidth: number;
    private _gridHeight: number;
    private _background: createjs.Shape;
    private _canvas: any;
    private _chomp:createjs.AbstractSoundInstance;
    private Grayscale:createjs.ColorMatrixFilter;

    private _startNode:Node;
    private _endNode:Node;
    public _nodes:any[];
    private _numCols:number;
    private _numRows:number;

    constructor(){
        super();
        this.mouseEnabled = true;
        this._pellets = new createjs.Container();
        this.addChild(this._pellets);

        this._numCols = Constants.MAZE_MAP[0].length;
        this._numRows = Constants.MAZE_MAP.length;
        this._nodes = [];
        
        for(var i:number = 0; i < this._numCols; i++) {
            this._nodes[i] = [];
            for(var j:number = 0; j < this._numRows; j++) {
                this._nodes[i][j] = new Node(i, j, Constants.MAZE_MAP[j].charAt(i) === '0');
                this._nodes[i][j].pixelX = ((i) * Constants.MAP_GAP) + (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2;
                this._nodes[i][j].pixelY = ((j) * Constants.MAP_GAP) + (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2;
            }
        }

        this.Grayscale = new createjs.ColorMatrixFilter([
				0.30, 0.30, 0.30, 0, 0, // red component
				0.30, 0.30, 0.30, 0, 0, // green component
				0.30, 0.30, 0.30, 0, 0, // blue component
				0, 0, 0, .15, 0 // alpha
			]);
    }

    public getNode(x:number, y:number):Node {
        return this._nodes[x][y];
    }

    public setWalkable(x:number, y:number, value:boolean) {
        this._nodes[x][y].walkable = value;
    }

    public setEndNode(x:number, y:number) {
        this._endNode = this._nodes[x][y];
    }

    public setStartNode(x:number, y:number) {
        this._startNode = this._nodes[x][y];
    }

    public get endNode():Node {
        return this._endNode;
    }

    public get numCols():number {
        return this._numCols;
    }

    public get numRows():number {
        return this._numRows;
    }

    public get startNode():Node {
        return this._startNode;
    }

    public updateNodeCosts(value:Lesson, id:number) {
        this._nodes.forEach((col, i) => {
            col.forEach((node, j) => {
                if(node.walkable) { 
                    node.costMultiplier = value.checkWalkable(node.pixelX, node.pixelY, id) ? 100 : 1;
                }
            })
        });
    }

    public setMaze(value: string, category: number) {
        var img = document.createElement("img");
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            this._canvas = this._maze.getBounds() || {width: 913, height: 680};
            this._gridWidth = this._canvas.width - Constants.MAP_BORDER * 2;
            this._gridHeight = this._canvas.height - Constants.MAP_BORDER * 2;
            this._maze.cache(0, 0, this._canvas.width, this._canvas.height);

            this._background = new createjs.Shape();
            this.updateMazeColor(category);

            this.addChildAt(this._background, 0);
            
                        
            this.dispatchEvent(Constants.MAZE_LOADED);
        }
        img.src = value;   

        console.log('create bitmap')
        this._maze = new createjs.Bitmap(value);               
    }

    public mazeHeight():number {
        return this._canvas.height;
    }

    public mazeWidth():number {
        return this._canvas.width;
    }

    public updateMazeColor(category:number) {
        var colors = Constants.CATEGORY_LIST.category[category].colours;

        if(this._background) {
            this._background.uncache();
        }
        this._background.graphics.clear();
        this._background.graphics.beginLinearGradientFill([
            `rgba(${colors[0].RED},${colors[0].GREEN},${colors[0].BLUE},1)`, 
            `rgba(${colors[1].RED},${colors[1].GREEN},${colors[1].BLUE},1)`], 
            [0, 1], 0, 0, this._maze.getBounds().width * .65, this._maze.getBounds().width * .5);
        this._background.graphics.drawRect(0, 0, this._maze.getBounds().width, this._maze.getBounds().height);
        this._background.cache(0, 0, this._canvas.width, this._canvas.height);
        this._background.filters = [new createjs.AlphaMaskFilter(this._maze.cacheCanvas as HTMLImageElement)]
        this._background.updateCache();
    }

    public initPellets(value: string) {
        this._pellets.removeAllChildren();
        Constants.MAZE_MAP.forEach((item, index) => {
            var row = item.split('');
            row.forEach((ritem, rindex) => {
                if(ritem == '0') {
                    var pellet:createjs.Bitmap = new createjs.Bitmap(value);
                    pellet.x = Constants.MAP_BORDER + (Constants.MAP_GAP * .5) + (Constants.MAP_GAP * rindex);
                    pellet.y = Constants.MAP_BORDER + (Constants.MAP_GAP * .5) + (Constants.MAP_GAP * index);
                    this._pellets.addChild(pellet);
                    var next:number = rindex + 1;

                    if(next < row.length && row[next] == '0' && !(rindex == 10 && index == 10)) {
                        var pellet:createjs.Bitmap = new createjs.Bitmap(value);
                        pellet.x = Constants.MAP_BORDER + (Constants.MAP_GAP) + (Constants.MAP_GAP * rindex);
                        pellet.y = Constants.MAP_BORDER + (Constants.MAP_GAP * .5) + (Constants.MAP_GAP * index);
                        this._pellets.addChild(pellet);
                    }

                    next = index + 1;
                    if(next < Constants.MAZE_MAP.length && Constants.MAZE_MAP[next].charAt(rindex) == '0') {
                        var pellet:createjs.Bitmap = new createjs.Bitmap(value);
                        pellet.x = Constants.MAP_BORDER + (Constants.MAP_GAP * .5) + (Constants.MAP_GAP * rindex);
                        pellet.y = Constants.MAP_BORDER + (Constants.MAP_GAP) + (Constants.MAP_GAP * index);
                        this._pellets.addChild(pellet);
                    }
                }
            });
        });

    }

    public nextBlock(direction: number): boolean {
        var r;

        try {
            switch(direction)
            {
                case Direction.RIGHT:
                    r = Constants.MAZE_MAP[this._currentRow - 1].charAt(this._currentColumn);
                    break;
                case Direction.LEFT:
                    r = Constants.MAZE_MAP[this._currentRow - 1].charAt(this._currentColumn - 2);
                    break;
                case Direction.UP:
                    r = Constants.MAZE_MAP[this._currentRow - 2].charAt(this._currentColumn - 1);
                    break;
                case Direction.DOWN:
                    r = Constants.MAZE_MAP[this._currentRow].charAt(this._currentColumn - 1);
                    break;
                case Direction.NONE:
                    r = '1';
                    break;
            }
        }
        catch(e) { 
            r = '1';
        }
        finally {
            return r == '0';
        }
    }

    public getGridLocation(value:ICurrentGrid):ICurrentGrid {
            value.x = (value.column * Constants.MAP_GAP) + (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2;
            value.y = (value.row * Constants.MAP_GAP) + (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2;
            return value;
    }

    public isGridAvailable(value:ICurrentGrid):boolean {
        return Constants.MAZE_MAP[value.row - 1].charAt(value.column - 1) == "0";
    }

    public getCurrentGrid(herox: number, heroy: number): ICurrentGrid {
        this._currentColumn = Math.round(herox / Constants.MAP_GAP);
        this._currentRow = Math.round(heroy / Constants.MAP_GAP);
        return {
            column: this._currentColumn, 
            row: this._currentRow, 
            x: (this._currentColumn * Constants.MAP_GAP) - (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2, 
            y: (this._currentRow * Constants.MAP_GAP) - (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2
        }
    }

    public eatPellets(minx: number, maxx: number, miny: number, maxy: number){
        this._pellets.children.forEach((item, index) => {
            if(item.x > minx && item.x < maxx && item.y > miny && item.y < maxy){
                this._pellets.removeChild(item);
                createjs.Sound.play("chomp", createjs.Sound.INTERRUPT_LATE, null, null, null, .05);
            }
        });
    }

    public blend() {
        var bnd = this.getBounds();
        this.cache(bnd.x, bnd.y, bnd.width, bnd.height);
		this.filters = [this.Grayscale];
		this.updateCache();
    }

    public unblend() {
        this.filters = [];
		this.uncache();
    }
}