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
        // Fg = mg
        return gravityStrength.mult(mass);
    };
    Physics.calcFrictionForce = function (coeffecient, normalForce) {
        // f = cn
        return normalForce.mult(coeffecient);
    };
    Physics.calcWindForce = function (density, area, velocity) {
        // air mass (Am) = density * area
        // acceleration (a) = windspeed * windspeed
        // F = Am * a
        var airMass = density * area;
        var acceleration = velocity.magSquared;
        var magnitude = airMass * acceleration;
        var force = velocity.normalizeMult(magnitude);
        return force;
    };
    Physics.calcNetForce = function (mass, acceleration) {
        // f = ma
        return acceleration.mult(mass);
    };
    Physics.calcMomentum = function (mass, velocity) {
        // m = mv
        return velocity.mult(mass);
    };
    Physics.calcAcceleration = function (netForce, mass) {
        // a = f / m
        return netForce.div(mass);
    };
    Physics.calcVelocity = function (currentVelocity, acceleration) {
        // v = v + a
        return currentVelocity.add(acceleration);
    };
    Physics.calcFinalVelocity = function (time, initialVelocity, acceleration) {
        // Vf = Vi + a * t
        return initialVelocity.add(acceleration.mult(time));
    };
    Physics.calcDisplacement = function (time, initialVelocity, acceleration) {
        // d = Vi * t + (a * t * t) / 2
        var velocityTime = initialVelocity.mult(time);
        var halfAccelerationTime = acceleration.mult(time * time).div(2);
        return velocityTime.add(halfAccelerationTime);
    };
    Physics.calcRotationAcceleration = function (force, mass) {
        // a = f / m
        return mass === 0 ? 0 : force / mass;
    };
    Physics.calcRotationVelocity = function (currentVelocity, acceleration) {
        // v = v + a;
        return currentVelocity + acceleration;
    };
    Physics.calcFinalRotationVelocity = function (time, initialVelocity, acceleration) {
        // Vf = Vi + a * t
        return initialVelocity + acceleration * time;
    };
    Physics.calcRotationDisplacement = function (time, initialVelocity, acceleration) {
        // d = Vi * t + (a * t * t) / 2
        var velocityTime = initialVelocity * time;
        var halfAccelerationTime = acceleration * time * time / 2;
        return velocityTime + halfAccelerationTime;
    };
    Physics.calcReflection = function (v, normal) {
        return v.reflectViaNormal(normal);
    };
    Physics.calcFriction = function (coeffecient, normal, velocity) {
        var magnitude = coeffecient * normal;
        var friction = velocity.mult(-1); // Friction applies in the opposite direction of motion.
        friction = friction.normalizeMult(magnitude);
        return friction;
    };
    Physics.calcDrag = function (density, area, coeffecient, velocity) {
        // F = 1/2 * p * ||v|| * ||v|| * A * Cd * -vNormal
        var halfDensity = density * 0.5;
        var densityMagSquared = halfDensity * velocity.magSquared;
        var densityMagArea = densityMagSquared * area;
        var magnitude = densityMagArea * coeffecient;
        var drag = velocity.normalizeMult(-magnitude); // Drag applies in the opposite direction of motion.
        return drag;
    };
    Physics.calcAverageAcceleration = function (initialVelocity, finalVelocity, time) {
        // AvgA = (fv - iv) / t
        return finalVelocity.subtract(initialVelocity).div(time);
    };
    Physics.calcAverageSpeed = function (distance, time) {
        // AvgS = d / t
        return distance / time;
    };
    Physics.calcAverageVelocity = function (initialPosition, finalPosition, time) {
        // AvgV = (fp - ip) / t
        return finalPosition.subtract(initialPosition).div(time);
    };
    /* // Use with standard velocity formula.
    static readonly pixelsPerMeter = 2;//0.1;
    static readonly gravityScale = 1;//0.01;
    /*/
    Physics.pixelsPerMeter = 70;
    Physics.gravityScale = 1;
    //*/
    Physics.gravitySun = 274;
    Physics.gravityJupiter = 24.92;
    Physics.gravityNeptune = 11.15;
    Physics.gravitySaturn = 10.44;
    Physics.gravityEarth = 9.798;
    Physics.gravityUranus = 8.87;
    Physics.gravityVenus = 8.87;
    Physics.gravityMars = 3.71;
    Physics.gravityMercury = 3.7;
    Physics.gravityMoon = 1.62;
    Physics.gravityPluto = 0.58;
    return Physics;
}());
//# sourceMappingURL=Physics.js.map