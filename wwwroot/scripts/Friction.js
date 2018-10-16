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
    function Friction() {
        return _super.call(this, Vector2D.empty, Vector2D.empty, -1) || this;
    }
    Friction.prototype.applyTo = function (character) {
        var normal = 1; // TODO: Calculate the proper normal;
        this._forceVector = Physics.calcFriction(character.frictionCoeffecient, normal, character.velocity);
        _super.prototype.applyTo.call(this, character);
    };
    return Friction;
}(Force));
//# sourceMappingURL=Friction.js.map