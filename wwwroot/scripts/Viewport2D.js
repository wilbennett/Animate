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
    function Viewport2D(_ctx, orientation, x, y, width, height) {
        var _this = _super.call(this, orientation, x, y, width, height) || this;
        _this._ctx = _ctx;
        _this.applyTransform = _this._isOrientedUp
            ?
                function () {
                    var ctx = this._ctx;
                    ctx.save();
                    ctx.translate(-this.left, this.top);
                    ctx.scale(1, -1);
                    ctx.beginPath();
                    ctx.rect(this._x, this._y, this._width, this._height);
                    ctx.clip();
                    ctx.closePath();
                }
            :
                function () {
                    this._ctx.save();
                    this._ctx.translate(-this.left, -this.top);
                };
        return _this;
    }
    Viewport2D.prototype.restoreTransform = function () {
        this._ctx.restore();
    };
    return Viewport2D;
}(ReadonlyBounds));
//# sourceMappingURL=Viewport2D.js.map