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
    function Character(position, _velocity, mass) {
        var _this = _super.call(this, position, mass) || this;
        _this._velocity = _velocity;
        _this._frictionCoeffecient = 0.01;
        _this._lastUpdateFrame = -1;
        _this._maxSpeed = -1;
        _this._rotateRadians = 0;
        _this._rotateVelocity = 0;
        _this._rotateAcceleration = 0;
        _this._maxRotateVelocity = 2;
        _this._squashX = 1;
        _this._squashY = 1;
        _this.resetParams();
        return _this;
    }
    Object.defineProperty(Character.prototype, "velocity", {
        get: function () { return this._velocity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "maxSpeed", {
        get: function () { return this._maxSpeed; },
        set: function (value) { this._maxSpeed = value; },
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
    Character.prototype.applyForce = function (force) {
        //console.log(this.getName(this) + " applying force from " + this.getName(force) + ": "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2) + "  :  "
        //    + force.force.x.toFixed(2) + ", " + force.force.y.toFixed(2));
        this._appliedForce = this._appliedForce.add(force.force);
    };
    Character.prototype.applyRotateForce = function (force) {
        this._appliedRotateForce = this._appliedRotateForce + force;
    };
    Character.prototype.resetParams = function () {
        this._appliedForce = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
        this._appliedRotateForce = 0;
        this._rotateAcceleration = 0;
    };
    Character.prototype.preUpdate = function (frame, timestamp, delta) {
        this.resetParams();
    };
    Character.prototype.adjustAcceleration = function () {
        //console.log("**** " + this.getName(this) + " calc acceleration with force: "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2));
        this._acceleration = Physics.calcAcceleration(this._appliedForce, this.mass);
    };
    Character.prototype.adjustVelocity = function () {
        var newVelocity = Physics.calcVelocity(this.velocity, this.acceleration);
        if (this.maxSpeed < 0 || newVelocity.mag < this.maxSpeed)
            this._velocity = newVelocity;
    };
    Character.prototype.adjustPosition = function (velocity, pixelsPerMeter) {
        this._position = this._position.add(Physics.toPixels(velocity, pixelsPerMeter));
    };
    Character.prototype.adjustRotateAcceleration = function () {
        this._rotateAcceleration = Physics.calcRotationAcceleration(this._appliedRotateForce, this._mass);
    };
    Character.prototype.adjustRotateVelocity = function () {
        var newVelocity = Physics.calcRotationVelocity(this.rotateVelocity, this.rotateAcceleration);
        if (Math.abs(newVelocity) < this.maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    };
    Character.prototype.update = function (frame, now, timeDelta, world) {
        this.adjustAcceleration();
        this.adjustVelocity();
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity();
        this.adjustPosition(this._velocity.mult(timeDelta), world.pixelsPerMeter);
        this._rotateRadians = MathEx.constrainRadians(this._rotateRadians + this._rotateVelocity * timeDelta);
        this._lastUpdateFrame = frame;
    };
    Character.prototype.draw = function (ctx, frame) {
    };
    return Character;
}(Force));
//# sourceMappingURL=Character.js.map