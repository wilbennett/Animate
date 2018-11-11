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
        set: function (value) { this._velocity = value; },
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
        set: function (value) { this._acceleration = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "rotateVelocity", {
        get: function () { return this._rotateVelocity; },
        set: function (value) { this._rotateVelocity = value; },
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
        set: function (value) { this._rotateAcceleration = value; },
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
        var a = Physics.calcAcceleration(force, this._mass);
        this._acceleration = this._acceleration.add(a);
    };
    Character.prototype.applyRotateForce = function (force) {
        var a = Physics.calcRotationAcceleration(force, this._mass);
        this._rotateAcceleration += a;
    };
    Character.prototype.applyUniversalForces = function () {
        var _this = this;
        this._universalForces.forEach(function (f, i, fs) { return f.applyTo(_this); });
    };
    Character.prototype.updateVelocity = function (frame, timestamp, delta) {
        var newVelocity = Physics.calcVelocity(this._velocity, this._acceleration);
        if (newVelocity.mag < this._maxVelocity)
            this._velocity = newVelocity;
    };
    Character.prototype.updateRotateVelocity = function (frame, timestamp, delta) {
        var newVelocity = Physics.calcRotationVelocity(this._rotateVelocity, this._rotateAcceleration);
        if (Math.abs(newVelocity) < this._maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    };
    Character.prototype.preUpdate = function (frame, timestamp, delta) {
        this._acceleration = Vector2D.empty;
        this._rotateAcceleration = 0;
    };
    Character.prototype.update = function (frame, timestamp, delta, characters) {
        this.applyUniversalForces();
        this.updateVelocity(frame, timestamp, delta);
        this.updateRotateVelocity(frame, timestamp, delta);
        this._position = this._position.add(this._velocity.mult(delta));
        this._rotateRadians += this._rotateVelocity * delta;
        this._rotateRadians = this._rotateRadians % MathEx.TWO_PI;
        this._lastUpdateFrame = frame;
    };
    Character.prototype.draw = function (ctx, frame) {
    };
    return Character;
}(Force));
//# sourceMappingURL=Character.js.map