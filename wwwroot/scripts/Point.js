"use strict";
var Point = /** @class */ (function () {
    function Point(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    Point.prototype.draw = function (ctx, size, color) {
        ctx.beginPath();
        ctx.arc(this._x, this._y, size, 0, MathEx.TWO_PI, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
    };
    return Point;
}());
//# sourceMappingURL=Point.js.map