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
var Vector2D = /** @class */ (function (_super) {
    __extends(Vector2D, _super);
    function Vector2D(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this._magSquared = -1;
        _this._mag = -1;
        _this._degrees = -1;
        _this._radians = -1;
        _this._polar = null;
        _this._normal = null;
        return _this;
    }
    Object.defineProperty(Vector2D.prototype, "magSquared", {
        get: function () {
            if (this._magSquared < 0)
                this._magSquared = Math2D.dot(this.x, this.y, this.x, this.y);
            return this._magSquared;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "mag", {
        get: function () {
            if (this._mag < 0)
                this._mag = Math.sqrt(this.magSquared);
            return this._mag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "radians", {
        get: function () {
            if (this._radians < 0)
                this._radians = Math2D.radians(this.x, this.y);
            return this._radians;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "degrees", {
        get: function () {
            if (this._degrees < 0)
                this._degrees = MathEx.toDegrees(this.radians);
            return this._degrees;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "polar", {
        get: function () {
            if (!this._polar)
                this._polar = new Polar2D(this.mag, this.radians);
            return this._polar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "normal", {
        get: function () {
            if (!this._normal) {
                this._normal = new Vector2D(this.y, -this.x);
            }
            return this._normal;
        },
        enumerable: true,
        configurable: true
    });
    Vector2D.prototype.toString = function () { "(" + this.x.toFixed(3) + ", " + this.y.toFixed(3) + ")"; };
    Object.defineProperty(Vector2D, "emptyVector", {
        get: function () {
            if (!this._emptyVector)
                this._emptyVector = new Vector2D(0, 0);
            return this._emptyVector;
        },
        enumerable: true,
        configurable: true
    });
    Vector2D.prototype.add = function (other) { return new Vector2D(this.x + other.x, this.y + other.y); };
    Vector2D.prototype.subtract = function (other) { return new Vector2D(this.x - other.x, this.y - other.y); };
    Vector2D.prototype.mult = function (scale) { return new Vector2D(this.x * scale, this.y * scale); };
    Vector2D.prototype.div = function (scale) { return new Vector2D(this.x / scale, this.y / scale); };
    Vector2D.prototype.dot = function (other) { return Math2D.dot(this.x, this.y, other.x, other.y); };
    Vector2D.prototype.normalize = function () {
        var m = this.mag;
        if (m <= 0)
            return this;
        return this.div(m);
    };
    Vector2D.prototype.directionTo = function (target) { return target.subtract(this); };
    Vector2D.prototype.radiansBetween = function (target) {
        var result = target.radians - this.radians;
        if (result < 0)
            result = MathEx.TWO_PI + result;
        return result;
    };
    Vector2D.prototype.degreesBetween = function (target) { return MathEx.toDegrees(this.radiansBetween(target)); };
    Vector2D.prototype.rotateRadiansAboutCore = function (x, y, angle, centerX, centerY) {
        var transX = x - centerX;
        var transY = y - centerY;
        var newX = transX * Math.cos(angle) - transY * Math.sin(angle);
        var newY = transX * Math.sin(angle) + transY * Math.cos(angle);
        return new Vector2D(newX + centerX, newY + centerY);
    };
    Vector2D.prototype.rotateRadians = function (angle) {
        return this.rotateRadiansAboutCore(this.x, this.y, angle, 0, 0);
    };
    Vector2D.prototype.rotateDegrees = function (angle) {
        return this.rotateRadians(MathEx.toRadians(angle));
    };
    Vector2D.prototype.rotateRadiansAbout = function (angle, center) {
        return this.rotateRadiansAboutCore(this.x, this.y, angle, center.x, center.y);
    };
    Vector2D.prototype.rotateDegreesAbout = function (angle, center) {
        return this.rotateRadiansAbout(MathEx.toRadians(angle), center);
    };
    Vector2D.prototype.reflectViaNormal = function (normal) {
        // -(2 * (v . normal) * normal - v)
        var dot2 = 2 * this.dot(normal);
        var dot2TimesNormal = Vector2D.mult(dot2, normal);
        return dot2TimesNormal.subtract(this).mult(-1);
        // v - 2 * (v . normal) * normal
        //return this.subtract(dot2TimesNormal);
    };
    Vector2D.prototype.reflectOff = function (reflector) {
        return this.reflectViaNormal(reflector.normal);
    };
    Vector2D.prototype.reflect = function (source) {
        return source.reflectViaNormal(this.normal);
    };
    Vector2D.prototype.withX = function (x) { return new Vector2D(x, this.y); };
    Vector2D.prototype.withY = function (y) { return new Vector2D(this.x, y); };
    Vector2D.fromRadians = function (angle) { return new Vector2D(Math.cos(angle), Math.sin(angle)); };
    Vector2D.fromDegrees = function (angle) { return this.fromRadians(MathEx.toRadians(angle)); };
    Vector2D.add = function (v1, v2) { return v1.add(v2); };
    Vector2D.subtract = function (v1, v2) { return v1.subtract(v2); };
    Vector2D.normalize = function (v) { return v.normalize(); };
    Vector2D.dot = function (v1, v2) { return v1.dot(v2); };
    Vector2D.mult = function (scale, v) {
        var vec;
        var scalar;
        if (v instanceof Vector2D) {
            vec = v;
            scalar = scale;
        }
        else {
            vec = scale;
            scalar = v;
        }
        return vec.mult(scalar);
    };
    Vector2D.div = function (scale, v) {
        var vec;
        var scalar;
        if (v instanceof Vector2D) {
            vec = v;
            scalar = scale;
        }
        else {
            vec = scale;
            scalar = v;
        }
        return vec.div(scalar);
    };
    return Vector2D;
}(Point2D));
//# sourceMappingURL=Vector2D.js.map