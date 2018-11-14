"use strict";
var Polar2D = /** @class */ (function () {
    function Polar2D(_radius, _radians) {
        this._radius = _radius;
        this._radians = _radians;
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
            if (!this._degrees)
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
    Polar2D.prototype.withRadius = function (radius) { return new Polar2D(radius, this.radians); };
    Polar2D.prototype.withRadians = function (radians) { return new Polar2D(this.radius, radians); };
    Polar2D.prototype.withDegrees = function (degrees) { return this.withRadians(MathEx.toRadians(degrees)); };
    Polar2D.prototype.addRadians = function (radiansDelta) { return this.withRadians(this._radians + radiansDelta); };
    return Polar2D;
}());
//# sourceMappingURL=Polar2D.js.map