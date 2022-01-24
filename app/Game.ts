import { AssetsManager } from './AssetsManager';
import { Constants } from './Constants';
import { Direction } from './Constants';
import { Category } from './Constants';
import { Hero } from './Hero';
import { Maze } from './Maze';
import { UserInterface } from './UserInterface';
import { Pathfinder } from './Pathfinder';
import { Lesson } from './Lesson';
import { Citation } from './Citation';
import { PopupWindow } from './PopupWindow';
import { ICurrentGrid } from './interfaces/ICurrentGrid';
import { Node } from './Node';
import { LocateNode } from './LocateNode';

export class Game {

    private canvas:HTMLElement;
    private stage:createjs.Stage;
    private hero:Hero;
    private gameboard:Maze;
    private lesson:Lesson;
    private ui:UserInterface;
    private citation:Citation;
    private category: number = Category.WEBSITE;
    private assets: AssetsManager;   
    private container: createjs.Container;
    private overlay: createjs.Container;
    private label: createjs.Text; 
    private direction: number = Direction.NONE;
    private next_direction: number = Direction.NONE;
    private popup:PopupWindow;
    private currentGrid: ICurrentGrid;
    private nextGrid: ICurrentGrid;
    private destinationGrid: ICurrentGrid;
    private speed: number = 5;
    private heroStartPosition = {x:11.5, y:11};
    private checkingResults:boolean = false;
    private autorun:boolean = false;
    private autorunInterupt:boolean = false;
    private pathfinder:Pathfinder;
    private doPathFinder:LocateNode;
    private touchIsEnabled:boolean = false;
    private touchDownPosition:any;
    private touchDragDistance:number = 30;

    constructor(manifest: any[]) {
        // create stage and point it to the canvas:
        this.canvas = document.getElementById("canvas");
        //check to see if we are running in a browser with touch support
        this.stage = new createjs.Stage(this.canvas);
        this.stage.autoClear = true;
        // enable touch interactions if supported on the current device:
        if (createjs.Touch.isSupported()) {
		    this.touchIsEnabled = createjs.Touch.enable(this.stage);
	    }
        // enabled mouse over / out events
        this.stage.enableMouseOver(5);
        // tick evvent
        createjs.Ticker.setFPS(40);
        
        this.container = new createjs.Container();
        this.stage.addChild(this.container); 

        this.overlay = new createjs.Container();
        this.stage.addChild(this.overlay)

        // create assetManagerObject as a container to display label and deal with the queueManager
        this.assets = new AssetsManager(manifest);
        this.assets.on(Constants.LOAD_COMPLETE, this.allAssetsLoaded, this, true);
        this.assets.startDownLoad();
    }

    private allAssetsLoaded(event:createjs.Event): void {
        event.stopImmediatePropagation();

        this.gameboard = new Maze();
        this.gameboard.on(Constants.MAZE_LOADED, this.buildGameBoard, this, true);
        this.container.addChild(this.gameboard);

        this.gameboard.setMaze(this.assets.getItemById('maze'), this.category);
        this.gameboard.initPellets(this.assets.getItemById('pellet'));
    }

    private buildGameBoard(e:createjs.Event) {
        this.lesson = new Lesson();
        this.lesson.on(Constants.AUTO_RUN, this.onAutoRun, this);
        this.lesson.on(Constants.PART_COLLECTED, this.onPartCollected, this);
        this.gameboard.addChild(this.lesson);

        this.addLessonInfo();

        this.citation = new Citation(this.assets.getItemById('iAssets'), "assets/citation_title", "assets/citation-box")
        this.citation.y = this.gameboard.y + this.gameboard.mazeHeight() + Constants.MAP_BORDER;
        this.container.addChild(this.citation);

        this.hero = new Hero(this.assets.getItemById('pacman'), 'pacman', 
        {
            x: (this.heroStartPosition.x - 1) * Constants.MAP_GAP  + Constants.MAP_BORDER + Constants.MAP_GAP/2, 
            y: ((this.heroStartPosition.y - 1) * Constants.MAP_GAP) + (Constants.MAP_GAP * .5) + Constants.MAP_BORDER + 2
        }, this.assets.getItemById('iAssets'), 'assets/thinking');
        this.gameboard.addChild(this.hero); 
        this.currentGrid = this.gameboard.getCurrentGrid(this.heroStartPosition.x, this.heroStartPosition.y);

        this.ui = new UserInterface();
        this.ui.build(this.assets.getItemById('iAssets'), "assets/instruction-normal", "assets/reset-normal");
        this.ui.on(Constants.INSTRUCTIONS, this.onShowInstructions, this);
        this.ui.on(Constants.RESET, this.resetCategory, this);
        this.gameboard.addChild(this.ui).set({
            x:this.gameboard.getBounds().width * .5 - this.ui.getBounds().width * .5, 
            y:300
        });
        this.createPopupWindow();

        createjs.Ticker.on("tick", this.tick, this);
        
        if(this.touchIsEnabled) {
            this.stage.on('stagemousedown', this.onTouchBoard, this, true);
        }

        window.addEventListener('keydown', this.keypress.bind(this));
        this.onShowInstructions(null);
        
        createjs.Sound.play("intro");
    }

    private onTouchBoard(e:createjs.MouseEvent) {
        this.touchDownPosition = {x: e.stageX, y: e.stageY};
        this.stage.on('stagemousemove', this.onTouchMove, this);
        this.stage.on('stagemouseup', this.onReleaseBoard, this, true)
    }

    private onReleaseBoard(e:createjs.MouseEvent) {
        this.stage.removeAllEventListeners('stagemousemove');
        this.stage.on('stagemousedown', this.onTouchBoard, this, true);
    }

    private onTouchMove(e:createjs.MouseEvent) {
        var xDiff:number = e.stageX - this.touchDownPosition.x;
        var yDiff:number = e.stageY - this.touchDownPosition.y;

        if(Math.abs(xDiff) > Math.abs(yDiff)) {
            if(xDiff > this.touchDragDistance) {
                this.next_direction = Direction.RIGHT;
                this.touchDownPosition = {x: e.stageX, y: e.stageY};
            } else if(xDiff < -this.touchDragDistance) {
                this.next_direction = Direction.LEFT;
                this.touchDownPosition = {x: e.stageX, y: e.stageY};
            }
        } else {
            if(yDiff > this.touchDragDistance) {
                this.next_direction = Direction.DOWN;
                this.touchDownPosition = {x: e.stageX, y: e.stageY};
            } else if(yDiff < -this.touchDragDistance) {
                this.next_direction = Direction.UP;
                this.touchDownPosition = {x: e.stageX, y: e.stageY};
            }
        }
       
    }

    private onAutoRun(e:createjs.Event) {
        this.hero.thinking(true);
        createjs.Tween.get(this.hero.think).to({alpha:1}, 100).wait(200).call(this.findPath, [e.node], this);
        //this.doPathFinder = e.node;
    }

    private findPath(node:LocateNode) {
        this.pathfinder = new Pathfinder();
        this.gameboard.setStartNode(this.currentGrid.column - 1, this.currentGrid.row - 1);
        this.gameboard.setEndNode(Math.round(node.location.column - 1), Math.round(node.location.row - 1));

        this.gameboard.updateNodeCosts(this.lesson, node.id);
        this.doPathFinder = null;
        if(this.pathfinder.findPath(this.gameboard)) {
            this.nextGrid = null;
            this.autorun = true;
            this.hero.thinking(false);
        }
    }

    private onPartCollected(e:createjs.Event) {
        this.autorunInterupt = true;
    }

    private drawBlock(value:ICurrentGrid){
        var b:createjs.Shape = new createjs.Shape();
        b.graphics.beginFill("#FF0000");
        b.graphics.drawRect(0,0,20,20);
        b.regX = b.regY = 10;
        this.overlay.addChild(b).set(value);
        
    }

    private createPopupWindow() {
        if(this.popup) return this.popup;
        this.popup = new PopupWindow(this.assets.getItemById('iAssets'));
        this.popup.on(Constants.CLOSE_WINDOW, this.closePopupWindow, this);
        this.popup.x = this.gameboard.mazeWidth() * .5;
        this.popup.y = this.gameboard.mazeHeight() * .5;
        return this.popup;
    }

    private showPopupWindow(value:string) {
        this.popup.show(value, this.category);
        this.overlay.addChild(this.popup);
        this.gameboard.blend();
    }

    private closePopupWindow(e:createjs.Event) {
        e.stopImmediatePropagation();
        this.overlay.removeChild(this.popup);
        this.gameboard.unblend();
        switch(e.next) { 
            case Constants.CORRECT: 
                this.nextCategory();
                break; 
            case Constants.INCORRECT:
                this.resetCategory();
                break;
            case Constants.INSTRUCTIONS:
            default:
                break;
        }
    }

    private checkCitation() {
        this.checkingResults = true;
        this.showPopupWindow(this.citation.isCorrect() ? Constants.CORRECT : Constants.INCORRECT);
    }

    private resetCategory() {
        this.checkingResults = false;
        this.lesson.clearParts();
        this.hero.reset();
        this.next_direction = this.direction = Direction.NONE;
        this.addLessonInfo();
        this.citation.clear();
        this.gameboard.initPellets(this.assets.getItemById('pellet'));
        this.gameboard.updateMazeColor(this.category);
         this.autorunInterupt = this.autorun = false;
    }

    private nextCategory() {
        this.checkingResults = false;
        this.lesson.clearParts();
        this.category++;
        if(this.category == 4) this.category = 0;
        this.hero.reset();
        this.next_direction = this.direction = Direction.NONE;
        this.addLessonInfo();
        this.citation.clear();
        this.gameboard.initPellets(this.assets.getItemById('pellet'));
        this.gameboard.updateMazeColor(this.category);
         this.autorunInterupt = this.autorun = false;
    }

    private addLessonInfo() {
        this.lesson.setTitle(this.assets.getItemById('iAssets'), 'assets/' + Constants.CATEGORY_LIST.category[this.category].title);

        var list = Constants.CATEGORY_LIST.category[this.category].parts;
        for(var n:number = 0; n < list.length; n++) {
            this.lesson.addPart(this.assets.getItemById('iAssets'), list[n], n);
        };
    }

    private onShowInstructions(e:createjs.Event) {
        if(this.container.contains(this.popup)) return;
        this.showPopupWindow(Constants.INSTRUCTIONS);
    }

    private keypress(e:KeyboardEvent) {
        if(this.checkingResults) return;

        if(this.autorun) this.autorunInterupt = this.autorun = false;
        switch(e.keyCode)
        {
            case 38: // Up
                this.next_direction = Direction.UP;
                break;
            case 39: // Right
                this.next_direction = Direction.RIGHT;
                break;
            case 37: // Left
                this.next_direction = Direction.LEFT;
                break;
            case 40: //Down
                this.next_direction = Direction.DOWN;
                break;
            case 82: //R Restart Level
                this.resetCategory();
                break;
            case 67: //C: Change Category
                if(e.shiftKey) this.nextCategory();
                break;
            case 73: //I Instructions
                this.onShowInstructions(null);
                break;
            case 80: //P Popup window
                if(this.container.contains(this.popup)) return;
                this.showPopupWindow(e.shiftKey ? Constants.CORRECT : Constants.INCORRECT);
                break;
        }

        if(this.direction == Direction.NONE) {
            this.direction = this.next_direction;
            this.next_direction = Direction.NONE;
        } 
    }

    private autoRunTick() {
        if(!this.nextGrid || (Math.abs(this.hero.y - this.nextGrid.y) < this.speed && Math.abs(this.hero.x - this.nextGrid.x) < this.speed)) {
            if(this.nextGrid) {
                this.hero.x = this.nextGrid.x;
                this.hero.y = this.nextGrid.y;
                if(this.autorunInterupt) {
                    this.autorunInterupt = this.autorun = false;
                }
            }

            if(!this.pathfinder.path.length) { 
                 this.autorunInterupt = this.autorun = false;
                this.nextGrid = null;
            } else {
                var node = this.pathfinder.path.shift();
                this.nextGrid = this.gameboard.getGridLocation({column: node.x, row: node.y});
            }
        }
        if(!this.nextGrid) return;

        if(this.hero.x > this.nextGrid.x) this.hero.x -= this.speed;
        else if(this.hero.x < this.nextGrid.x) this.hero.x += this.speed;
        else if(this.hero.y > this.nextGrid.y) this.hero.y -= this.speed;
        else if(this.hero.y < this.nextGrid.y) this.hero.y += this.speed;
    }

    private tick(e:createjs.Event):void {    
        this.stage.update(e);

        if(this.checkingResults) return;
        this.gameboard.eatPellets(this.hero.x - 15, this.hero.x + 15, this.hero.y - 15, this.hero.y + 15);  
        this.currentGrid = this.gameboard.getCurrentGrid(this.hero.x, this.hero.y);
        this.citation.addPart(this.lesson.eatPart(this.hero));

        if(!this.lesson.hasParts() && !this.checkingResults) this.checkCitation();

        if(this.gameboard.nextBlock(this.next_direction)) {
            if((this.next_direction > 2 && Math.abs(this.hero.y - this.currentGrid.y) < this.speed) ||
                (this.next_direction < 3 && Math.abs(this.hero.x - this.currentGrid.x) < this.speed)) {
                    this.direction = this.next_direction;
                    this.next_direction = Direction.NONE;
            } 
        }
        
        switch(this.direction) {
            case Direction.UP:
                this.hero.x = this.currentGrid.x;
                if(!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.y - this.currentGrid.y) < this.speed){
                    this.hero.y = this.currentGrid.y;
                    this.direction = Direction.NONE;
                } else {
                    this.hero.y -= this.speed;
                }
                break;
            case Direction.RIGHT:
                this.hero.y = this.currentGrid.y;
                if(!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.x - this.currentGrid.x) < this.speed){
                    this.hero.x = this.currentGrid.x;
                    this.direction = Direction.NONE;
                } else {
                    this.hero.x += this.speed;
                }
                break;
            case Direction.LEFT:
                this.hero.y = this.currentGrid.y;
                if(!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.x - this.currentGrid.x) < this.speed){
                    this.hero.x = this.currentGrid.x;
                    this.direction = Direction.NONE;
                } else {
                    this.hero.x -= this.speed;
                }
                break;
            case Direction.DOWN:
                this.hero.x = this.currentGrid.x;
                if(!this.gameboard.nextBlock(this.direction) && Math.abs(this.hero.y - this.currentGrid.y) < this.speed){
                    this.hero.y = this.currentGrid.y;
                    this.direction = Direction.NONE;
                } else {
                    this.hero.y += this.speed;
                }
                break;
            case Direction.NONE:

                break;
        }

        if(this.autorun) this.autoRunTick();
    } 
   

}