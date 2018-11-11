"use strict";
var Point2D = /** @class */ (function () {
    function Point2D(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    Object.defineProperty(Point2D.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point2D.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point2D, "emptyPoint", {
        get: function () {
            if (!this._emptyPoint)
                this._emptyPoint = new Point2D(0, 0);
            return this._emptyPoint;
        },
        enumerable: true,
        configurable: true
    });
    Point2D.prototype.draw = function (ctx, size, color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, MathEx.TWO_PI, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
    };
    return Point2D;
}());
//# sourceMappingURL=Point2D.js.map