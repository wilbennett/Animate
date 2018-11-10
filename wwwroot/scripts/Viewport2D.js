"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Viewport2D = /** @class */ (function (_super) {
    __extends(Viewport2D, _super);
    function Viewport2D(orientation, x, y, width, height, screenX, screenY, screenWidth, screenHeight) {
        return _super.call(this, orientation, x, y, width, height, screenX, screenY, screenWidth, screenHeight) || this;
    }
    return Viewport2D;
}(ScreenBounds));
//# sourceMappingURL=Viewport2D.js.map