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
    function Gravity(orientation, _gravityConst, position, width, height) {
        var _this = _super.call(this, Vector2D.emptyVector, 0) || this;
        _this._gravityConst = _gravityConst;
        _this._gravityConst = _this._gravityConst * Physics.gravityScale;
        if (orientation === WorldOrientation.Up)
            _this._gravityConst = -_this._gravityConst;
        _this._position = position;
        _this._width = width;
        _this._height = height;
        return _this;
    }
    Object.defineProperty(Gravity.prototype, "gravityConst", {
        get: function () { return this._gravityConst; },
        enumerable: true,
        configurable: true
    });
    Gravity.prototype.calculateForce = function () { };
    Gravity.prototype.calculateForceForCharacter = function (character) {
        return new Vector2D(0, this._gravityConst * character.mass);
    };
    return Gravity;
}(Force));
//# sourceMappingURL=Gravity.js.map