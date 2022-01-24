System.register(['./Constants', './Utils/Dictionary'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Constants_1, Dictionary_1;
    var AssetsManager;
    return {
        setters:[
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            },
            function (Dictionary_1_1) {
                Dictionary_1 = Dictionary_1_1;
            }],
        execute: function() {
            AssetsManager = (function (_super) {
                __extends(AssetsManager, _super);
                function AssetsManager(manifest) {
                    _super.call(this);
                    this.counter_files = 0;
                    this.len_manifest = 0;
                    console.log("AssetsManger constructor");
                    this.assets = new Dictionary_1.Dictionary();
                    this.manifest = manifest;
                    this.len_manifest = manifest.length;
                }
                AssetsManager.prototype.getItemById = function (value) {
                    return this.assets.Item(value);
                };
                AssetsManager.prototype.startDownLoad = function () {
                    this.loader = new createjs.LoadQueue();
                    this.loader.installPlugin(createjs.Sound);
                    this.loader.on("fileload", this.handleFileLoad, this);
                    this.loader.on("complete", this.handleComplete, this);
                    this.loader.on("progress", this.handleProgress, this);
                    this.loader.on("error", this.handleError, this);
                    this.loader.loadManifest(this.manifest);
                };
                AssetsManager.prototype.handleError = function (err) {
                    console.warn(err);
                };
                AssetsManager.prototype.handleProgress = function (event) {
                };
                AssetsManager.prototype.handleFileLoad = function (event) {
                    this.counter_files++;
                    switch (event.item.type) {
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
                };
                AssetsManager.prototype.handleComplete = function (event) {
                    event.stopImmediatePropagation();
                    event.currentTarget.removeAllEventListeners();
                    console.log("HandleComplete : ALl Files loaded ", this.counter_files);
                    this.dispatchEvent(Constants_1.Constants.LOAD_COMPLETE, this);
                };
                return AssetsManager;
            }(createjs.EventDispatcher));
            exports_1("AssetsManager", AssetsManager);
        }
    }
});
//# sourceMappingURL=AssetsManager.js.map