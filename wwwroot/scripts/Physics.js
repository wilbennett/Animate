"use strict";
var Physics = /** @class */ (function () {
    function Physics() {
    }
    Physics.metersToPixels = function (meters, pixelsPerMeter) {
        if (pixelsPerMeter === void 0) { pixelsPerMeter = this.pixelsPerMeter; }
        return meters * pixelsPerMeter;
    };
    Physics.pixelsToMeters = function (pixels, pixelsPerMeter) {
        if (pixelsPerMeter === void 0) { pixelsPerMeter = this.pixelsPerMeter; }
        return pixels / pixelsPerMeter;
    };
    Physics.toPixels = function (meters, pixelsPerMeter) {
        if (pixelsPerMeter === void 0) { pixelsPerMeter = this.pixelsPerMeter; }
        return new Vector2D(this.metersToPixels(meters.x, pixelsPerMeter), this.metersToPixels(meters.y, pixelsPerMeter));
    };
    Physics.toMeters = function (pixels, pixelsPerMeter) {
        if (pixelsPerMeter === void 0) { pixelsPerMeter = this.pixelsPerMeter; }
        return new Vector2D(this.pixelsToMeters(pixels.x, pixelsPerMeter), this.pixelsToMeters(pixels.y, pixelsPerMeter));
    };
    Physics.calcGravityForce = function (mass, gravityStrength) {
        return gravityStrength.mult(mass);
    };
    Physics.calcFrictionForce = function (coeffecient, normalForce) {
        return normalForce.mult(coeffecient);
    };
    Physics.calcNetForce = function (mass, acceleration) {
        return acceleration.mult(mass);
    };
    Physics.calcAcceleration = function (netForce, mass) {
        return netForce.div(mass);
    };
    Physics.calcVelocity = function (currentVelocity, acceleration) {
        return Vector2D.add(currentVelocity, acceleration);
    };
    Physics.calcRotationAcceleration = function (force, mass) {
        return force / mass;
    };
    Physics.calcRotationVelocity = function (currentVelocity, acceleration) {
        return currentVelocity + acceleration;
    };
    Physics.calcReflection = function (v, normal) {
        return v.reflectViaNormal(normal);
    };
    Physics.calcFriction = function (coeffecient, normal, velocity) {
        var c = coeffecient;
        var magnitude = c * normal;
        var friction = velocity.mult(-1); // Friction applies in the opposite direction of motion.
        friction = friction.normalize();
        friction = friction.mult(magnitude);
        return friction;
    };
    Physics.calcDrag = function (coeffecient, velocity) {
        var c = coeffecient;
        var magnitude = c * velocity.magSquared;
        var drag = Vector2D.mult(velocity, -1); // Drag applies in the opposite direction of motion.
        drag = drag.normalize();
        drag = drag.mult(magnitude);
        return drag;
    };
    Physics.calcAverageAcceleration = function (initialVelocity, finalVelocity, time) {
        return finalVelocity.subtract(initialVelocity).div(time);
    };
    Physics.calcAverageSpeed = function (distance, time) {
        return distance / time;
    };
    Physics.calcAverageVelocity = function (initialPosition, finalPosition, time) {
        return finalPosition.subtract(initialPosition).div(time);
    };
    Physics.gravityEarth = 9.8;
    //static readonly pixelsPerMeter = 0.1;
    Physics.pixelsPerMeter = 0.07;
    return Physics;
}());
//# sourceMappingURL=Physics.js.map