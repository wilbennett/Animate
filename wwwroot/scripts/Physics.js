"use strict";
var Physics = /** @class */ (function () {
    function Physics() {
    }
    Physics.calcAcceleration = function (force, mass) {
        return Vector.div(force, mass);
    };
    Physics.calcVelocity = function (currentVelocity, acceleration) {
        return Vector.add(currentVelocity, acceleration);
    };
    Physics.calcRotationAcceleration = function (force, mass) {
        return force / mass;
    };
    Physics.calcRotationVelocity = function (currentVelocity, acceleration) {
        return currentVelocity + acceleration;
    };
    Physics.calcFriction = function (coeffecient, normal, velocity) {
        var c = coeffecient;
        var magnitude = c * normal;
        var friction = Vector.mult(velocity, -1); // Friction applies in the opposite direction of motion.
        friction.normalize();
        friction.mult(magnitude);
        return friction;
    };
    Physics.calcDrag = function (coeffecient, velocity) {
        var c = coeffecient;
        var magnitude = c * velocity.magSquared;
        var drag = Vector.mult(velocity, -1); // Drag applies in the opposite direction of motion.
        drag.normalize();
        drag.mult(magnitude);
        return drag;
    };
    return Physics;
}());
//# sourceMappingURL=Physics.js.map