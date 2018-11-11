"use strict";
var Polar = /** @class */ (function () {
    function Polar(_radius, _radians) {
        this._radius = _radius;
        this._radians = _radians;
        this._degrees = -1;
        this._vector = null;
    }
    Object.defineProperty(Polar.prototype, "radius", {
        get: function () { return this._radius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polar.prototype, "radians", {
        get: function () { return this._radians; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polar.prototype, "degrees", {
        get: function () {
            if (this._degrees < 0)
                this._degrees = MathEx.toDegrees(this.radians);
            return this._degrees;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polar.prototype, "vector", {
        get: function () {
            if (!this._vector)
                this._vector = new Vector2D(this._radius * Math.cos(this._radians), this._radius * Math.sin(this._radians));
            return this._vector;
        },
        enumerable: true,
        configurable: true
    });
    Polar.prototype.addRadians = function (radiansDelta) {
        var newAngle = this._radians + radiansDelta;
        if (newAngle < 0 || newAngle > MathEx.TWO_PI)
            newAngle %= MathEx.TWO_PI;
        return new Polar(this.radius, newAngle);
    };
    return Polar;
}());
//# sourceMappingURL=Polar.js.map