class Physics {
    static readonly gravityEarth = 9.8;
    static readonly pixelsPerMeter = 0.07;

    static metersToPixels(meters: number, pixelsPerMeter: number = this.pixelsPerMeter) {
        return meters * pixelsPerMeter;
    }

    static pixelsToMeters(pixels: number, pixelsPerMeter: number = this.pixelsPerMeter) {
        return pixels / pixelsPerMeter;
    }

    static toPixels(meters: Vector2D, pixelsPerMeter: number = this.pixelsPerMeter) {
        return new Vector2D(
            this.metersToPixels(meters.x, pixelsPerMeter),
            this.metersToPixels(meters.y, pixelsPerMeter));
    }

    static toMeters(pixels: Vector2D, pixelsPerMeter: number = this.pixelsPerMeter) {
        return new Vector2D(
            this.pixelsToMeters(pixels.x, pixelsPerMeter),
            this.pixelsToMeters(pixels.y, pixelsPerMeter));
    }

    static calcGravityForce(mass: number, gravityStrength: Vector2D) {
        // Fg = mg
        return gravityStrength.mult(mass);
    }

    static calcFrictionForce(coeffecient: number, normalForce: Vector2D) {
        // f = cn
        return normalForce.mult(coeffecient);
    }

    static calcNetForce(mass: number, acceleration: Vector2D) {
        // f = ma
        return acceleration.mult(mass);
    }

    static calcMomentum(mass: number, velocity: Vector2D) {
        // m = mv
        return velocity.mult(mass);
    }

    static calcAcceleration(netForce: Vector2D, mass: number) {
        // a = f / m
        return netForce.div(mass);
    }

    static calcVelocity(currentVelocity: Vector2D, acceleration: Vector2D) {
        // v = v + a
        return currentVelocity.add(acceleration);
    }

    static calcRotationAcceleration(force: number, mass: number) {
        // a = f / m
        return force / mass;
    }

    static calcRotationVelocity(currentVelocity: number, acceleration: number) {
        // v = v + a;
        return currentVelocity + acceleration;
    }

    static calcReflection(v: Vector2D, normal: Vector2D): Vector2D {
        return v.reflectViaNormal(normal);
    }

    static calcFriction(coeffecient: number, normal: number, velocity: Vector2D) {
        let magnitude = coeffecient * normal;

        let friction = velocity.mult(-1); // Friction applies in the opposite direction of motion.
        friction = friction.normalizeMult(magnitude);
        return friction;
    }

    static calcDrag(density: number, area: number, coeffecient: number, velocity: Vector2D) {
        // F = 1/2 * p * ||v|| * ||v|| * A * Cd * -vNormal
        let halfDensity = density * 0.5;
        let densityMagSquared = halfDensity * velocity.magSquared;
        let densityMagArea = densityMagSquared * area;
        let magnitude = densityMagArea * coeffecient;

        let drag = velocity.normalizeMult(-magnitude); // Drag applies in the opposite direction of motion.

        return drag;
    }

    static calcAverageAcceleration(initialVelocity: Vector2D, finalVelocity: Vector2D, time: number) {
        // AvgA = (fv - iv) / t
        return finalVelocity.subtract(initialVelocity).div(time);
    }

    static calcAverageSpeed(distance: number, time: number) {
        // AvgS = d / t
        return distance / time;
    }

    static calcAverageVelocity(initialPosition: Vector2D, finalPosition: Vector2D, time: number) {
        // AvgV = (fp - ip) / t
        return finalPosition.subtract(initialPosition).div(time);
    }
}