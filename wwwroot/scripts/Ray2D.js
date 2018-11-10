"use strict";
var Ray2D = /** @class */ (function () {
    function Ray2D(_origin, direction, _length) {
        this._origin = _origin;
        this._length = _length;
        this._direction = direction.normalize();
        this._endPoint = this.getPointAt(this._length);
    }
    Object.defineProperty(Ray2D.prototype, "origin", {
        get: function () { return this._origin; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ray2D.prototype, "direction", {
        get: function () { return this._direction; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ray2D.prototype, "length", {
        get: function () { return this._length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ray2D.prototype, "endPoint", {
        get: function () { return this._endPoint; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ray2D.prototype, "normal", {
        get: function () { return this.direction.normal; },
        enumerable: true,
        configurable: true
    });
    Ray2D.prototype.getPointAt = function (length) {
        //console.log(`Origin (${this.origin.x}, ${this.origin.y}) - Direction (${this.direction.x}, ${this.direction.y})`);
        var result = Vector2D.mult(length, this.direction);
        result.add(this.origin);
        return result;
    };
    Ray2D.prototype.drawLine = function (ctx, width, color, bounds) {
        var origin = this.origin;
        var endPoint = this.endPoint;
        if (bounds) {
            origin = bounds.toScreen(origin);
            endPoint = bounds.toScreen(endPoint);
        }
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        //console.log(`length: ${length}  - (${this.origin.x}, ${this.origin.y}) -> (${this._endPoint.x}, ${this._endPoint.y})`);
    };
    Ray2D.prototype.draw = function (ctx, width, color, bounds) {
        this.drawLine(ctx, width, color, bounds);
        var origin = bounds ? bounds.toScreen(this.origin) : this.origin;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.ellipse(origin.x, origin.y, width, width, 0, 0, 2 * Math.PI);
        ctx.fill();
    };
    Ray2D.prototype.reflectViaNormal = function (normal) {
        var reflection = this.direction.reflectViaNormal(normal);
        return new Ray2D(this.endPoint, reflection, this.length);
    };
    Ray2D.prototype.reflectOff = function (reflector) {
        return this.reflectViaNormal(reflector.normal);
    };
    Ray2D.prototype.reflect = function (source) {
        return source.reflectViaNormal(this.normal);
    };
    return Ray2D;
}());
//# sourceMappingURL=Ray2D.js.map