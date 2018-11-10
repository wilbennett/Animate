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
var Liquid = /** @class */ (function (_super) {
    __extends(Liquid, _super);
    function Liquid(position, _frictionCoeffecient, _width, _height) {
        var _this = _super.call(this, position, new Vector2D(0, 0), new Vector2D(0, 0), 0, 0) || this;
        _this._frictionCoeffecient = _frictionCoeffecient;
        _this._width = _width;
        _this._height = _height;
        return _this;
    }
    Object.defineProperty(Liquid.prototype, "bounds", {
        get: function () {
            return new Bounds(this._position.x, this._position.y, this._width, this._height);
        },
        enumerable: true,
        configurable: true
    });
    Liquid.prototype.applyTo = function (character) {
        if (!Math2D.isPointInBounds(this.bounds, character.position.x, character.position.y))
            return;
        var c = this._frictionCoeffecient + character.frictionCoeffecient;
        this._forceVector = Physics.calcDrag(c, character.velocity);
        _super.prototype.applyTo.call(this, character);
    };
    Liquid.prototype.update = function (frame, timestamp, delta, characters) {
        //super.update(frame, timestamp, delta, characters);
        var _this = this;
        characters.forEach(function (character) { return _this.applyTo(character); }, this);
    };
    Liquid.prototype.draw = function (ctx) {
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
    return Liquid;
}(Character));
//# sourceMappingURL=Liquid.js.map