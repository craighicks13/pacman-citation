import { Constants } from './Constants';
import { Dictionary } from './Utils/Dictionary'


export class AssetsManager extends createjs.EventDispatcher {


    private assets: Dictionary<any>;
    private manifest: any[];
    private loader:createjs.LoadQueue;

    private label_filesDownload: createjs.Text;
    private label_percentDownload: createjs.Text;

    private counter_files: number = 0;
    private len_manifest: number = 0;
   

    constructor(manifest: any[]) {

        super();

        console.log("AssetsManger constructor");
        this.assets = new Dictionary<any>();
        this.manifest = manifest;
        this.len_manifest = manifest.length;
    }

    public getItemById(value:string):any {
        return this.assets.Item(value);
    }

    public startDownLoad(): void {

        this.loader = new createjs.LoadQueue();
        this.loader.installPlugin(<any>createjs.Sound);
        this.loader.on("fileload", this.handleFileLoad, this);
        this.loader.on("complete", this.handleComplete, this);
        this.loader.on("progress", this.handleProgress, this);
        this.loader.on("error", this.handleError, this);

        this.loader.loadManifest(this.manifest);

    }
    private handleError(err:createjs.ErrorEvent) {
        console.warn(err);
    }

    private handleProgress(event:createjs.Event) {
        
    }

    private handleFileLoad(event:createjs.Event) {
        this.counter_files++;
        
        switch(event.item.type)
        {
            case createjs.AbstractLoader.SPRITESHEET:
                this.assets.Add(event.item.id, this.loader.getResult(event.item.id));
                break;
            case createjs.AbstractLoader.IMAGE:
                this.assets.Add(event.item.id, event.item.src);
                break;
            case createjs.AbstractLoader.SOUND:
                createjs.Sound.registerSound(event.item.src, event.item.id);
                break;
        }
    }



    private handleComplete(event:createjs.Event) {
        event.stopImmediatePropagation();
        event.currentTarget.removeAllEventListeners();

        console.log("HandleComplete : ALl Files loaded ", this.counter_files);
        
        this.dispatchEvent(Constants.LOAD_COMPLETE, this);
    }

}


