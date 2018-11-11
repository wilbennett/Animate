"use strict";
var Polar2D = /** @class */ (function () {
    function Polar2D(_radius, _radians) {
        this._radius = _radius;
        this._radians = _radians;
        this._degrees = -1;
        this._vector = null;
    }
    Object.defineProperty(Polar2D.prototype, "radius", {
        get: function () { return this._radius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polar2D.prototype, "radians", {
        get: function () { return this._radians; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polar2D.prototype, "degrees", {
        get: function () {
            if (this._degrees < 0)
                this._degrees = MathEx.toDegrees(this.radians);
            return this._degrees;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polar2D.prototype, "vector", {
        get: function () {
            if (!this._vector)
                this._vector = new Vector2D(this._radius * Math.cos(this._radians), this._radius * Math.sin(this._radians));
            return this._vector;
        },
        enumerable: true,
        configurable: true
    });
    Polar2D.prototype.addRadians = function (radiansDelta) {
        var newAngle = this._radians + radiansDelta;
        if (newAngle < 0 || newAngle > MathEx.TWO_PI)
            newAngle %= MathEx.TWO_PI;
        return new Polar2D(this.radius, newAngle);
    };
    return Polar2D;
}());
//# sourceMappingURL=Polar2D.js.map