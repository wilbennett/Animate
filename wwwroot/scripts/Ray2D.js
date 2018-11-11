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
        return result.add(this.origin);
    };
    Ray2D.prototype.drawLine = function (ctx, lineWidth, color, bounds) {
        var origin = this.origin;
        var endPoint = this.endPoint;
        if (bounds) {
            origin = bounds.toScreen(origin);
            endPoint = bounds.toScreen(endPoint);
            lineWidth = lineWidth * Math.max(bounds.boundsToScreenScaleX, bounds.boundsToScreenScaleY);
        }
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        //console.log(`length: ${length}  - (${this.origin.x}, ${this.origin.y}) -> (${this._endPoint.x}, ${this._endPoint.y})`);
    };
    Ray2D.prototype.rotateRadians = function (angle) {
        return new Ray2D(this.origin, this.direction.rotateRadians(angle), this.length);
    };
    Ray2D.prototype.rotateDegrees = function (angle) {
        return this.rotateRadians(MathEx.toRadians(angle));
    };
    Ray2D.prototype.rotateRadiansAbout = function (angle, center) {
        var newOrigin = this.origin.rotateRadiansAbout(angle, center);
        return new Ray2D(newOrigin, newOrigin.directionTo(this.endPoint.rotateRadiansAbout(angle, center)), this.length);
    };
    Ray2D.prototype.rotateDegreesAbout = function (angle, center) {
        return this.rotateRadiansAbout(MathEx.toRadians(angle), center);
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
    Ray2D.prototype.draw = function (ctx, lineWidth, color, bounds) {
        this.drawLine(ctx, lineWidth, color, bounds);
        var origin = this.origin;
        var endPoint = this.endPoint;
        var triangleBase = this.getPointAt(this.length * 0.9);
        if (bounds) {
            origin = bounds.toScreen(origin);
            endPoint = bounds.toScreen(endPoint);
            triangleBase = bounds.toScreen(triangleBase);
            lineWidth = lineWidth * Math.max(bounds.boundsToScreenScaleX, bounds.boundsToScreenScaleY);
        }
        var triangleLeft = triangleBase.rotateDegreesAbout(-45, endPoint);
        var triangleRight = triangleBase.rotateDegreesAbout(45, endPoint);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.ellipse(origin.x, origin.y, lineWidth, lineWidth, 0, 0, 2 * Math.PI);
        ctx.fill();
        // TODO: Fix alignment.
        ctx.beginPath();
        ctx.strokeStyle = color;
        //ctx.fillStyle = "white";
        //ctx.strokeStyle = "white";
        ctx.lineWidth = lineWidth;
        ctx.moveTo(endPoint.x, endPoint.y);
        ctx.lineTo(triangleLeft.x, triangleLeft.y);
        ctx.lineTo(triangleRight.x, triangleRight.y);
        ctx.fill();
        ctx.stroke();
    };
    Ray2D.fromPoints = function (start, end) {
        var direction = start.directionTo(end);
        return new Ray2D(start, direction, direction.mag);
    };
    return Ray2D;
}());
//# sourceMappingURL=Ray2D.js.map