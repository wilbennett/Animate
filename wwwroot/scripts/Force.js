"use strict";
var Force = /** @class */ (function () {
    function Force(_position, _forceVector, _forceRadius) {
        this._position = _position;
        this._forceVector = _forceVector;
        this._forceRadius = _forceRadius;
        this.twoPI = 2 * Math.PI;
    }
    Object.defineProperty(Force.prototype, "forceVector", {
        get: function () { return this._forceVector; },
        enumerable: true,
        configurable: true
    });
    Force.prototype.applyTo = function (character) {
        character.applyForce(this._forceVector);
    };
    return Force;
}());
//# sourceMappingURL=Force.js.map