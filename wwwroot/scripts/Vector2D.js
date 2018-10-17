"use strict";
var Vector2D = /** @class */ (function () {
    function Vector2D(_x, _y) {
        this._x = _x;
        this._y = _y;
        this._magSquared = -1;
        this._mag = -1;
        this._degrees = -1;
        this._radians = -1;
        this._polar = null;
    }
    Object.defineProperty(Vector2D.prototype, "x", {
        get: function () { return this._x; },
        set: function (value) { this._x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "y", {
        get: function () { return this._y; },
        set: function (value) { this._y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "magSquared", {
        get: function () {
            if (this._magSquared < 0)
                this._magSquared = Math2D.dot(this._x, this._y, this._x, this._y);
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
                this._radians = Math2D.radians(this._x, this._y);
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
                this._polar = new Polar(this.mag, this.radians);
            return this._polar;
        },
        enumerable: true,
        configurable: true
    });
    Vector2D.prototype.toString = function () { "(" + this._x.toFixed(3) + ", " + this._y.toFixed(3) + ")"; };
    Object.defineProperty(Vector2D, "empty", {
        get: function () { return new Vector2D(0, 0); },
        enumerable: true,
        configurable: true
    });
    Vector2D.prototype.clone = function () {
        var result = new Vector2D(this.x, this.y);
        result._mag = this._mag;
        result._degrees = this._degrees;
        result._radians = this._radians;
        result._polar = this._polar;
        return result;
    };
    Vector2D.prototype.reset = function () {
        this._mag = -1;
        this._degrees = -1;
        this._radians = -1;
        this._polar = null;
    };
    Vector2D.prototype.add = function (other) {
        this._x += other.x;
        this._y += other.y;
        this.reset();
        return this;
    };
    Vector2D.prototype.subtract = function (other) {
        this._x -= other.x;
        this._y -= other.y;
        this.reset();
        return this;
    };
    Vector2D.prototype.mult = function (scale) {
        this._x *= scale;
        this._y *= scale;
        this.reset();
        return this;
    };
    Vector2D.prototype.div = function (scale) {
        this._x /= scale;
        this._y /= scale;
        this.reset();
        return this;
    };
    Vector2D.prototype.dot = function (scale) {
        this._x /= scale;
        this._y /= scale;
        this.reset();
        return this;
    };
    Vector2D.prototype.normalize = function () {
        var m = this.mag;
        if (m <= 0)
            return this;
        this.div(m);
        this.reset();
        return this;
    };
    Vector2D.add = function (v1, v2) { return v1.clone().add(v2); };
    Vector2D.subtract = function (v1, v2) { return v1.clone().subtract(v2); };
    Vector2D.normalize = function (v) { return v.clone().normalize(); };
    Vector2D.mult = function (scale, v) {
        var vec;
        var scalar;
        if (typeof v === "object") {
            vec = v;
            scalar = scale;
        }
        else {
            vec = scale;
            scalar = v;
        }
        vec = vec.clone();
        vec.mult(scalar);
        return vec;
    };
    Vector2D.div = function (scale, v) {
        var vec;
        var scalar;
        if (typeof v === "object") {
            vec = v;
            scalar = scale;
        }
        else {
            vec = scale;
            scalar = v;
        }
        vec = vec.clone();
        vec.div(scalar);
        return vec;
    };
    return Vector2D;
}());
//# sourceMappingURL=Vector2D.js.map