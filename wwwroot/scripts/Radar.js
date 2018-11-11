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
var Radar = /** @class */ (function (_super) {
    __extends(Radar, _super);
    function Radar(position, _radius, _color, _angleVelocity) {
        var _this = _super.call(this, position, Vector2D.empty, Vector2D.empty, 0, 0) || this;
        _this._radius = _radius;
        _this._color = _color;
        _this._angleVelocity = _angleVelocity;
        _this._armPos = null;
        _this._armManager = new Polar(_this._radius * 0.95, 0);
        return _this;
    }
    Object.defineProperty(Radar.prototype, "radius", {
        get: function () { return this._radius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Radar.prototype, "color", {
        get: function () { return this._color; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Radar.prototype, "radians", {
        get: function () { return this._armManager.radians; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Radar.prototype, "degrees", {
        get: function () { return this._armManager.degrees; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Radar.prototype, "armPos", {
        get: function () {
            if (this._armPos === null)
                this._armPos = this._armManager.vector.add(this._position);
            return this._armPos;
        },
        enumerable: true,
        configurable: true
    });
    Radar.prototype.updateRotateVelocity = function (frame, timestamp, delta) {
        this._armManager = this._armManager.addRadians(this._angleVelocity * delta);
        this._armPos = null;
    };
    Radar.prototype.draw = function (ctx, frame) {
        _super.prototype.draw.call(this, ctx, frame);
        ctx.strokeStyle = this._color;
        ctx.beginPath();
        ctx.arc(this._position.x, this._position.y, this._radius, 0, MathEx.TWO_PI);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(this._position.x, this._position.y);
        ctx.lineTo(this.armPos.x, this.armPos.y);
        ctx.stroke();
        ctx.closePath();
    };
    return Radar;
}(Character));
//# sourceMappingURL=Radar.js.map