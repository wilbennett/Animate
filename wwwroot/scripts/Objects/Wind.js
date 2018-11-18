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
var Wind = /** @class */ (function (_super) {
    __extends(Wind, _super);
    function Wind(degrees, strength, position, _radius) {
        var _this = _super.call(this, position, Vector2D.fromDegrees(degrees).mult(strength), 0) || this;
        _this._radius = _radius;
        _this._radiusPct = 0.10;
        _this._width = _this._radius * 2;
        _this._height = _this._width;
        _this._polar = new Polar2D(strength, MathEx.toRadians(degrees));
        _this.polarUpdated();
        return _this;
    }
    Object.defineProperty(Wind.prototype, "degrees", {
        get: function () { return this._polar.degrees; },
        set: function (value) { this.radians = MathEx.toRadians(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wind.prototype, "radians", {
        get: function () { return this._polar.radians; },
        set: function (value) {
            this._polar = this._polar.withRadians(value);
            this.polarUpdated();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wind.prototype, "strength", {
        get: function () { return this._polar.radius; },
        set: function (value) {
            this._polar = new Polar2D(value, this.radians);
            this.polarUpdated();
        },
        enumerable: true,
        configurable: true
    });
    Wind.prototype.polarUpdated = function () {
        this._velocity = this._polar.vector.normalize();
    };
    Wind.prototype.createBounds = function () { return this.createBoundsFromRadius(this._radius); };
    Wind.prototype.calculateForce = function () { };
    Wind.prototype.calculateForceForCharacter = function (character) {
        var pos = character.position.subtract(this.position);
        if (pos.mag > this._polar.radius)
            return Vector2D.emptyVector;
        var force = this._velocity.mult(pos.magSquared * 0.01);
        return force.div(character.velocity.mag);
    };
    Wind.prototype.update = function (frame, now, elapsedTime, timeScale, world) {
        //super.update(frame, now, elapsedTime, timeScale, world);
        this._radiusPct = (this._radiusPct + 0.01) % 0.9 + 0.10;
    };
    Wind.prototype.draw = function (viewport, frame) {
        _super.prototype.draw.call(this, viewport, frame);
        var ctx = viewport.ctx;
        var origAlpha = ctx.globalAlpha;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, 10, 10, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = "purple";
        ctx.fill();
        ctx.closePath();
        var v = this._velocity.mult(this._polar.radius * 0.5);
        v = v.add(this.position);
        ctx.beginPath();
        ctx.strokeStyle = "purple";
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.globalAlpha = 0.6;
        ctx.globalAlpha = this._radiusPct;
        ctx.arc(this.position.x, this.position.y, this._polar.radius * this._radiusPct, 0, MathEx.TWO_PI);
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = origAlpha;
    };
    return Wind;
}(Character2D));
//# sourceMappingURL=Wind.js.map