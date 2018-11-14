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
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(position, _velocity, _acceleration, _mass, _maxVelocity) {
        var _this = _super.call(this, position, new Vector2D(0, 0), 0) || this;
        _this._velocity = _velocity;
        _this._acceleration = _acceleration;
        _this._mass = _mass;
        _this._maxVelocity = _maxVelocity;
        _this._universalForces = [];
        _this._frictionCoeffecient = 0.01;
        _this._lastUpdateFrame = -1;
        _this._rotateRadians = 0;
        _this._rotateVelocity = 0;
        _this._rotateAcceleration = 0;
        _this._maxRotateVelocity = 2;
        _this._squashX = 1;
        _this._squashY = 1;
        return _this;
    }
    Object.defineProperty(Character.prototype, "position", {
        get: function () { return this._position; },
        set: function (value) { this._position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "velocity", {
        get: function () { return this._velocity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "maxVelocity", {
        get: function () { return this._maxVelocity; },
        set: function (value) { this._maxVelocity = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "acceleration", {
        get: function () { return this._acceleration; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "rotateVelocity", {
        get: function () { return this._rotateVelocity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "maxRotateVelocity", {
        get: function () { return this._maxRotateVelocity; },
        set: function (value) { this._maxRotateVelocity = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "rotateAcceleration", {
        get: function () { return this._rotateAcceleration; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "mass", {
        get: function () { return this._mass; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "frictionCoeffecient", {
        get: function () { return this._frictionCoeffecient; },
        set: function (value) { this._frictionCoeffecient = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "squashX", {
        get: function () { return this._squashX; },
        set: function (value) { this._squashX = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "squashY", {
        get: function () { return this._squashY; },
        set: function (value) { this._squashY = value; },
        enumerable: true,
        configurable: true
    });
    Character.prototype.addUniversalForce = function (force) { this._universalForces.push(force); };
    Character.prototype.removeUniversalForce = function (force) {
        var index = this._universalForces.indexOf(force);
        if (index > -1) {
            this._universalForces.splice(index, 1);
        }
    };
    Character.prototype.applyForce = function (force) {
        this._appliedForce = this._appliedForce.add(force);
    };
    Character.prototype.applyRotateForce = function (force) {
        this._appliedRotateForce = this._appliedRotateForce + force;
    };
    Character.prototype.applyUniversalForces = function () {
        var _this = this;
        this._universalForces.forEach(function (f, i, fs) { return f.applyForceTo(_this); });
    };
    Character.prototype.preUpdate = function (frame, timestamp, delta) {
        this._appliedForce = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
        this._appliedRotateForce = 0;
        this._rotateAcceleration = 0;
    };
    Character.prototype.adjustAcceleration = function () {
        this._acceleration = Physics.calcAcceleration(this._appliedForce, this.mass);
    };
    Character.prototype.adjustVelocity = function () {
        var newVelocity = Physics.calcVelocity(this.velocity, this.acceleration);
        if (newVelocity.mag < this.maxVelocity)
            this._velocity = newVelocity;
    };
    Character.prototype.adjustPosition = function (velocity) {
        this._position = this._position.add(Physics.toPixels(velocity));
    };
    Character.prototype.adjustRotateAcceleration = function () {
        this._rotateAcceleration = Physics.calcRotationAcceleration(this._appliedRotateForce, this._mass);
    };
    Character.prototype.adjustRotateVelocity = function () {
        var newVelocity = Physics.calcRotationVelocity(this.rotateVelocity, this.rotateAcceleration);
        if (Math.abs(newVelocity) < this.maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    };
    Character.prototype.update = function (frame, now, timeDelta, characters) {
        this.applyUniversalForces();
        this.adjustAcceleration();
        this.adjustVelocity();
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity();
        this.adjustPosition(this._velocity.mult(timeDelta));
        this._rotateRadians = MathEx.constrainRadians(this._rotateRadians + this._rotateVelocity * timeDelta);
        this._lastUpdateFrame = frame;
    };
    Character.prototype.draw = function (ctx, frame) {
    };
    return Character;
}(Force));
//# sourceMappingURL=Character.js.map