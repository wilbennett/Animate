"use strict";
var Vector = /** @class */ (function () {
    function Vector(_x, _y) {
        var _this = this;
        this._x = _x;
        this._y = _y;
        this._magSquared = -1;
        this._mag = -1;
        this._degrees = -1;
        this._radians = -1;
        this._polar = null;
        this.toString = function () { return "(" + _this._x.toFixed(3) + ", " + _this._y.toFixed(3) + ")"; };
    }
    Object.defineProperty(Vector.prototype, "x", {
        get: function () { return this._x; },
        set: function (value) { this._x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () { return this._y; },
        set: function (value) { this._y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "magSquared", {
        get: function () {
            if (this._magSquared < 0)
                this._magSquared = Math2D.dot(this._x, this._y, this._x, this._y);
            return this._magSquared;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "mag", {
        get: function () {
            if (this._mag < 0)
                this._mag = Math.sqrt(this.magSquared);
            return this._mag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "radians", {
        get: function () {
            if (this._radians < 0)
                this._radians = Math2D.radians(this._x, this._y);
            return this._radians;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "degrees", {
        get: function () {
            if (this._degrees < 0)
                this._degrees = MathEx.toDegrees(this.radians);
            return this._degrees;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "polar", {
        get: function () {
            if (!this._polar)
                this._polar = new Polar(this.mag, this.radians);
            return this._polar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector, "empty", {
        get: function () { return new Vector(0, 0); },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.reset = function () {
        this._mag = -1;
        this._degrees = -1;
        this._radians = -1;
        this._polar = null;
    };
    Vector.prototype.add = function (other) {
        this._x += other.x;
        this._y += other.y;
        this.reset();
    };
    Vector.prototype.subtract = function (other) {
        this._x -= other.x;
        this._y -= other.y;
        this.reset();
    };
    Vector.prototype.mult = function (scale) {
        this._x *= scale;
        this._y *= scale;
        this.reset();
    };
    Vector.prototype.div = function (scale) {
        this._x /= scale;
        this._y /= scale;
        this.reset();
    };
    Vector.prototype.dot = function (scale) {
        this._x /= scale;
        this._y /= scale;
        this.reset();
    };
    Vector.prototype.normalize = function () {
        var m = this.mag;
        if (m <= 0)
            return;
        this.div(m);
        this.reset();
    };
    Vector.add = function (v1, v2) { return new Vector(v1.x + v2.x, v1.y + v2.y); };
    Vector.subtract = function (v1, v2) { return new Vector(v1.x - v2.x, v1.y - v2.y); };
    Vector.mult = function (v, scale) { return new Vector(v.x * scale, v.y * scale); };
    Vector.div = function (v, scale) { return new Vector(v.x / scale, v.y / scale); };
    Vector.normalize = function (v) { return v.mag > 0 ? Vector.div(v, v.mag) : v; };
    return Vector;
}());
//# sourceMappingURL=Vector.js.map