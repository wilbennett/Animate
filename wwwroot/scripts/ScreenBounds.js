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
var ScreenBounds = /** @class */ (function (_super) {
    __extends(ScreenBounds, _super);
    function ScreenBounds(orientation, x, y, width, height, screenX, screenY, screenWidth, screenHeight) {
        var _this = _super.call(this, orientation, x, y, width, height) || this;
        if (!screenWidth)
            screenWidth = width;
        if (!screenHeight)
            screenHeight = height;
        _this._screenTopLeft = new Vector2D(screenX, screenY);
        _this._screenWidth = screenWidth;
        _this._screenHeight = screenHeight;
        _this.calcScreenOffsets();
        return _this;
    }
    ScreenBounds.prototype.applyClipRegionToContext = function (ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();
        ctx.closePath();
    };
    ScreenBounds.prototype.applyTransformToContext = function (ctx) {
        if (this.isTransformed)
            return;
        ctx.save();
        if (this._isOrientedUp) {
            ctx.transform(this._boundsToScreenScaleX, 0, 0, -this._boundsToScreenScaleY, this.screenLeft - this.x * this._boundsToScreenScaleX, this.screenTop + (this.y * this._boundsToScreenScaleY + this.screenHeight - 1));
        }
        else {
            ctx.transform(this._boundsToScreenScaleX, 0, 0, this._boundsToScreenScaleY, this.screenLeft - this.x * this._boundsToScreenScaleX, this.screenTop - this.y * this._boundsToScreenScaleY);
        }
        this.applyClipRegionToContext(ctx);
        this._isTransformed = true;
    };
    return ScreenBounds;
}(OrientedBounds));
//# sourceMappingURL=ScreenBounds.js.map