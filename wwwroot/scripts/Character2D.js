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
var Character2D = /** @class */ (function (_super) {
    __extends(Character2D, _super);
    function Character2D(position, _velocity, mass) {
        var _this = _super.call(this, position, mass) || this;
        _this._velocity = _velocity;
        _this._frictionCoefficient = 0.01;
        _this._dragCoefficient = 0.01;
        _this._restitutionCoefficient = 0.5;
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
    Object.defineProperty(Character2D.prototype, "velocity", {
        get: function () { return this._velocity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "maxSpeed", {
        get: function () { return this._maxSpeed; },
        set: function (value) { this._maxSpeed = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "rotateVelocity", {
        get: function () { return this._rotateVelocity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "maxRotateVelocity", {
        get: function () { return this._maxRotateVelocity; },
        set: function (value) { this._maxRotateVelocity = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "rotateAcceleration", {
        get: function () { return this._rotateAcceleration; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "frictionCoefficient", {
        get: function () { return this._frictionCoefficient; },
        set: function (value) { this._frictionCoefficient = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "dragCoefficient", {
        get: function () { return this._dragCoefficient; },
        set: function (value) { this._dragCoefficient = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "restitutionCoeffecient", {
        get: function () { return this._restitutionCoefficient; },
        set: function (value) { this._restitutionCoefficient = MathEx.clamp(value, 0, 1); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "momentum", {
        get: function () { return Physics.calcMomentum(this.mass, this.velocity); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "squashX", {
        get: function () { return this._squashX; },
        set: function (value) { this._squashX = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character2D.prototype, "squashY", {
        get: function () { return this._squashY; },
        set: function (value) { this._squashY = value; },
        enumerable: true,
        configurable: true
    });
    Character2D.prototype.applyForce = function (force) {
        //console.log(this.getName(this) + " applying force from " + this.getName(force) + ": "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2) + "  :  "
        //    + force.force.x.toFixed(2) + ", " + force.force.y.toFixed(2));
        this._appliedForce = this._appliedForce.add(force.force);
    };
    Character2D.prototype.applyRotateForce = function (force) {
        this._appliedRotateForce = this._appliedRotateForce + force;
    };
    Character2D.prototype.resetParams = function () {
        this._appliedForce = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
        this._appliedRotateForce = 0;
        this._rotateAcceleration = 0;
    };
    Character2D.prototype.adjustAcceleration = function () {
        //console.log("**** " + this.getName(this) + " calc acceleration with force: "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2));
        this._acceleration = Physics.calcAcceleration(this._appliedForce, this.mass);
    };
    Character2D.prototype.adjustVelocity = function () {
        var newVelocity = Physics.calcVelocity(this.velocity, this.acceleration);
        if (this.maxSpeed < 0 || newVelocity.mag < this.maxSpeed)
            this._velocity = newVelocity;
    };
    Character2D.prototype.adjustPosition = function (velocity, pixelsPerMeter) {
        this._position = this._position.add(Physics.toPixels(velocity, pixelsPerMeter));
    };
    Character2D.prototype.adjustRotateAcceleration = function () {
        this._rotateAcceleration = Physics.calcRotationAcceleration(this._appliedRotateForce, this._mass);
    };
    Character2D.prototype.adjustRotateVelocity = function () {
        var newVelocity = Physics.calcRotationVelocity(this.rotateVelocity, this.rotateAcceleration);
        if (Math.abs(newVelocity) < this.maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    };
    Character2D.prototype.preUpdate = function (frame, timestamp, delta) {
        this.resetParams();
    };
    Character2D.prototype.update = function (frame, now, timeDelta, world) {
        this.adjustAcceleration();
        this.adjustVelocity();
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity();
        this.adjustPosition(this._velocity.mult(timeDelta), world.pixelsPerMeter);
        this._rotateRadians = MathEx.constrainRadians(this._rotateRadians + this._rotateVelocity * timeDelta);
        this._lastUpdateFrame = frame;
    };
    Character2D.prototype.draw = function (viewport, frame) {
    };
    return Character2D;
}(Force));
//# sourceMappingURL=Character2D.js.map