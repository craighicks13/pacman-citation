System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Snippet;
    return {
        setters:[],
        execute: function() {
            Snippet = (function (_super) {
                __extends(Snippet, _super);
                function Snippet(spritesheet, frame) {
                    _super.call(this, spritesheet, frame);
                    this.mouseEnabled = true;
                    this.cursor = 'pointer';
                }
                return Snippet;
            }(createjs.Sprite));
            exports_1("Snippet", Snippet);
        }
    }
});
//# sourceMappingURL=Snippet.js.map