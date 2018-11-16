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
        var result = this.direction.mult(length);
        return result.add(this.origin);
    };
    Ray2D.prototype.radiansBetween = function (target) { return this.direction.radiansBetween(target.direction); };
    Ray2D.prototype.degreesBetween = function (target) { return MathEx.toDegrees(this.radiansBetween(target)); };
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
    //*
    Ray2D.prototype.getInstersection = function (target) {
        var thisOrigin = this.origin;
        var targetOrigin = target.origin;
        var thisDirection = this.direction;
        var targetDirection = target.direction;
        var det = thisDirection.y * targetDirection.x - thisDirection.x * targetDirection.y;
        if (det === 0)
            return null;
        var dx = thisOrigin.x - targetOrigin.x;
        var dy = targetOrigin.y - thisOrigin.y;
        var t1 = (targetDirection.x * dy + targetDirection.y * dx) / det;
        if (t1 < 0 || t1 > this.length)
            return null;
        //let t2 = (thisDirection.x * dy + thisDirection.y * dx) / det;
        //if (t2 < 0 || t2 > target.length) return null;
        return this.getPointAt(t1);
    };
    /*/
    getInstersection(target: Ray2D): Vector2D | null {
        let a1 = this.endPoint.y - this.origin.y;
        let b1 = this.origin.x - this.endPoint.x;
        let c1 = a1 * this.origin.x + b1 * this.origin.y;
        let a2 = target.endPoint.y - target.origin.y;
        let b2 = target.origin.x - target.endPoint.x;
        let c2 = a2 * target.origin.x + b2 * target.origin.y;

        let det = a1 * b2 - a2 * b1;

        if (det === 0) return null;

        let x = (b2 * c1 - b1 * c2) / det;
        let y = (a1 * c2 - a2 * c1) / det;

        if (x < Math.min(this.origin.x, this.endPoint.x) || x > Math.max(this.origin.x, this.endPoint.x)) return null;
        if (y < Math.min(this.origin.y, this.endPoint.y) || y > Math.max(this.origin.y, this.endPoint.y)) return null;

        //if (x < Math.min(target.origin.x, target.endPoint.x) || x > Math.max(target.origin.x, target.endPoint.x)) return null;
        //if (y < Math.min(target.origin.y, target.endPoint.y) || y > Math.max(target.origin.y, target.endPoint.y)) return null;

        return new Vector2D(x, y);
    }
    //*/
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