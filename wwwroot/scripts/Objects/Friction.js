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
var Friction = /** @class */ (function (_super) {
    __extends(Friction, _super);
    function Friction(position, width, height) {
        var _this = _super.call(this, position, 0) || this;
        _this._width = width;
        _this._height = height;
        return _this;
    }
    Friction.prototype.calculateForce = function () { };
    Friction.prototype.calculateForceForCharacter = function (character) {
        var normal = Vector2D.unitVector; // TODO: Calculate the proper normal;
        return Physics.calcFriction(character.frictionCoefficient, normal, character.velocity);
    };
    return Friction;
}(Force));
//# sourceMappingURL=Friction.js.map