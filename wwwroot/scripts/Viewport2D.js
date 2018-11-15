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
    function Viewport2D(_ctx, orientation, x, y, width, height, screenX, screenY, screenWidth, screenHeight) {
        var _this = _super.call(this, orientation, x, y, width, height, screenX, screenY, screenWidth, screenHeight) || this;
        _this._ctx = _ctx;
        return _this;
    }
    Object.defineProperty(Viewport2D.prototype, "ctx", {
        get: function () { return this._ctx; },
        enumerable: true,
        configurable: true
    });
    Viewport2D.prototype.draw = function (ctx, width, color, bounds) {
        _super.prototype.draw.call(this, this.ctx, width, color, this.isTransformed ? undefined : this);
    };
    Viewport2D.prototype.applyTransform = function () { _super.prototype.applyTransformToContext.call(this, this.ctx); };
    Viewport2D.prototype.restoreTransform = function () { _super.prototype.restoreTransformToContext.call(this, this.ctx); };
    return Viewport2D;
}(ScreenBounds));
//# sourceMappingURL=Viewport2D.js.map