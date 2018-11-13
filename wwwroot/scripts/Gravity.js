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
var Gravity = /** @class */ (function (_super) {
    __extends(Gravity, _super);
    function Gravity(_orientation, _gravityConst) {
        var _this = _super.call(this, new Vector2D(0, 0), new Vector2D(0, 0), -1) || this;
        _this._orientation = _orientation;
        _this._gravityConst = _gravityConst;
        if (_this._orientation === WorldOrientation.Up)
            _this._gravityConst = -_this._gravityConst;
        return _this;
    }
    Object.defineProperty(Gravity.prototype, "gravityConst", {
        get: function () { return this._gravityConst; },
        enumerable: true,
        configurable: true
    });
    Gravity.prototype.applyTo = function (character) {
        //this._forceVector = new Vector2D(0, 0);
        //this._forceVector = new Vector2D(0, this._gravityConst);
        // Gravity applies along the y axis.
        // All objects fall at the same rate because the effect of gravity is proportional to the mass of the object.
        this._forceVector = new Vector2D(0, this._gravityConst * character.mass);
        _super.prototype.applyTo.call(this, character);
    };
    return Gravity;
}(Force));
//# sourceMappingURL=Gravity.js.map