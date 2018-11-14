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
    function Wind(position, degrees, strength) {
        var _this = _super.call(this, position, Vector2D.emptyVector, 0) || this;
        _this._radiusPct = 0.10;
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
        this._velocity = Vector2D.normalize(this._polar.vector);
    };
    Wind.prototype.calculateForceForCharacter = function (character) {
        var pos = Vector2D.subtract(character.position, this.position);
        if (pos.mag > this._polar.radius)
            return;
        this._force = Vector2D.mult(this._velocity, pos.magSquared * 0.01);
        this._force = this._force.div(character.velocity.mag);
    };
    Wind.prototype.update = function (frame, timestamp, delta, characters) {
        //super.update(frame, timestamp, delta, characters);
        var _this = this;
        characters.forEach(function (character) { return _this.applyForceTo(character); }, this);
        this._radiusPct = (this._radiusPct + 0.01) % 0.9 + 0.10;
    };
    Wind.prototype.draw = function (ctx, frame) {
        var origAlpha = ctx.globalAlpha;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, 10, 10, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = "purple";
        ctx.fill();
        ctx.closePath();
        var v = Vector2D.mult(this._velocity, this._polar.radius * 0.5);
        v = v.add(this._position);
        ctx.beginPath();
        ctx.strokeStyle = "purple";
        ctx.moveTo(this._position.x, this._position.y);
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
}(Character));
//# sourceMappingURL=Wind.js.map