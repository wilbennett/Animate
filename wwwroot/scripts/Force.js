"use strict";
var Force = /** @class */ (function () {
    function Force(_position, _mass) {
        this._position = _position;
        this._mass = _mass;
        this._force = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
    }
    Object.defineProperty(Force.prototype, "position", {
        get: function () { return this._position; },
        set: function (value) { this._position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "force", {
        get: function () { return this._force; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "mass", {
        get: function () { return this._mass; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "acceleration", {
        get: function () { return this._acceleration; },
        enumerable: true,
        configurable: true
    });
    Force.prototype.calculateForce = function () {
        this._force = Physics.calcNetForce(this._mass, this._acceleration);
    };
    Force.prototype.calculateForceForCharacter = function (character) { return this._force; };
    Force.prototype.applyForceTo = function (character) {
        if (character === this)
            return;
        this._force = this.calculateForceForCharacter(character);
        character.applyForce(this);
    };
    Force.prototype.getName = function (obj) {
        var match = /function (\w+)/.exec(obj.constructor.toString());
        return match ? match[1] : "*UNKNOWN*";
    };
    return Force;
}());
//# sourceMappingURL=Force.js.map