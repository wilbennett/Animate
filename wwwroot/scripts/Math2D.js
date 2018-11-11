"use strict";
var Math2D = /** @class */ (function () {
    function Math2D() {
    }
    Math2D.dot = function (x1, y1, x2, y2) { return x1 * x2 + y1 * y2; };
    Math2D.magnitudeSquared = function (x, y) { return Math2D.dot(x, y, x, y); };
    Math2D.magnitude = function (x, y) { return Math.sqrt(Math2D.magnitudeSquared(x, y)); };
    Math2D.radians = function (x, y) {
        var result = Math.atan2(y, x);
        if (result < 0)
            result = MathEx.TWO_PI + result;
        return result;
    };
    Math2D.degrees = function (x, y) { return MathEx.toDegrees(Math2D.radians(x, y)); };
    Math2D.polar = function (x, y) { return new Polar2D(Math2D.magnitude(x, y), Math2D.radians(x, y)); };
    Math2D.inflateBoundsCore = function (bounds, dx, dy) {
        var newLeft = bounds[0] - dx;
        var newTop = bounds[1] - dy;
        var newWidth = bounds[2] + dx + dx;
        var newHeight = bounds[3] + dy + dy;
        if (newWidth < 0 && newHeight < 0) {
            bounds[2] = 0;
            bounds[3] = 0;
        }
        else if (newWidth < 0) {
            bounds[2] = 0;
            bounds[3] = newHeight;
        }
        else if (newHeight < 0) {
            bounds[2] = newWidth;
            bounds[3] = 0;
        }
        else {
            bounds[0] = newLeft;
            bounds[1] = newTop;
            bounds[2] = newWidth;
            bounds[3] = newHeight;
        }
        return bounds;
    };
    Math2D.inflateBounds = function (x, y, w, h, dx, dy) {
        if (Array.isArray(x)) {
            var bounds = x;
            dx = y;
            dy = w;
            return this.inflateBoundsCore(bounds, dx, dy);
        }
        if (typeof x === "object") {
            var obj = x;
            dx = y;
            dy = w;
            return this.inflateBoundsCore([obj.x, obj.y, obj.width, obj.height], dx, dy);
        }
        return this.inflateBoundsCore([x, y, w, h], dx, dy);
    };
    Math2D.isPointInBoundsCore = function (x, y, w, h, px, py) {
        return px >= x && py >= y && px < (x + w) && py < (y + h);
    };
    Math2D.isPointInBounds = function (x, y, w, h, px, py) {
        if (Array.isArray(x)) {
            var bounds = x;
            px = y;
            py = w;
            return this.isPointInBoundsCore(bounds[0], bounds[1], bounds[2], bounds[3], px, py);
        }
        if (typeof x === "object") {
            var obj = x;
            px = y;
            py = w;
            return this.isPointInBoundsCore(obj.x, obj.y, obj.width, obj.height, px, py);
        }
        return this.isPointInBoundsCore(x, y, w, h, px, py);
    };
    return Math2D;
}());
//# sourceMappingURL=Math2D.js.map