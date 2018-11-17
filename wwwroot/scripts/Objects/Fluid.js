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
var Fluid = /** @class */ (function (_super) {
    __extends(Fluid, _super);
    function Fluid(position, _density, dragCoefficient, width, height) {
        var _this = _super.call(this, position, Vector2D.emptyVector, 0) || this;
        _this._density = _density;
        _this.dragCoefficient = dragCoefficient;
        _this._width = width;
        _this._height = height;
        return _this;
    }
    Object.defineProperty(Fluid.prototype, "density", {
        get: function () { return this._density; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fluid.prototype, "bounds", {
        get: function () {
            return new Bounds(this._position.x, this._position.y, this._width, this._height);
        },
        enumerable: true,
        configurable: true
    });
    Fluid.prototype.calculateForce = function () { };
    Fluid.prototype.calculateForceForCharacter = function (character) {
        if (!Math2D.isPointInBounds(this.bounds, character.position.x, character.position.y))
            return Vector2D.emptyVector;
        return Physics.calcDrag(this.density, 1, this.dragCoefficient, character.velocity);
    };
    Fluid.prototype.update = function (frame, now, elapsedTime, timeScale, world) {
    };
    Fluid.prototype.draw = function (viewport, frame) {
        var ctx = viewport.ctx;
        var origAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "gray";
        var rect = this.bounds;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = origAlpha;
    };
    return Fluid;
}(Character2D));
//# sourceMappingURL=Fluid.js.map