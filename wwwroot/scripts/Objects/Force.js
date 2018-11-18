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
        set: function (value) {
            this._position = value;
            this._bounds = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "width", {
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "height", {
        get: function () { return this._height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "w", {
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "h", {
        get: function () { return this._height; },
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
    Object.defineProperty(Force.prototype, "world", {
        get: function () { return this._world; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Force.prototype, "bounds", {
        get: function () {
            if (!this._bounds)
                this._bounds = this.createBounds();
            return this._bounds;
        },
        enumerable: true,
        configurable: true
    });
    Force.prototype.createBounds = function () {
        return new Bounds(this.position.x, this.position.y, this.width, this.height);
    };
    Force.prototype.createBoundsFromRadius = function (radius) {
        return this.world.orientation === WorldOrientation.Up
            ? new Bounds(this.position.x - radius, this.position.y - radius, this.w, this.h)
            : new Bounds(this.position.x - radius, this.position.y + radius, this.w, this.h);
    };
    Force.prototype.addedToWorld = function (world) { this._world = world; };
    Force.prototype.intersectsWithCharacter = function (character) { return this.bounds.intersectsWith(character.bounds); };
    Force.prototype.calculateForce = function () {
        this._force = Physics.calcNetForce(this._mass, this._acceleration);
    };
    Force.prototype.calculateForceForCharacter = function (character) { return this._force; };
    Force.prototype.applyForceTo = function (character) {
        if (character === this)
            return;
        if (!this.intersectsWithCharacter(character))
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