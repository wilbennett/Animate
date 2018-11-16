class Physics {
    static readonly gravityEarth = 9.8;
    //static readonly pixelsPerMeter = 0.1;
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
        return gravityStrength.mult(mass);
    }

    static calcFrictionForce(coeffecient: number, normalForce: Vector2D) {
        return normalForce.mult(coeffecient);
    }

    static calcNetForce(mass: number, acceleration: Vector2D) {
        return acceleration.mult(mass);
    }

    static calcMomentum(mass: number, velocity: Vector2D) {
        return velocity.mult(mass);
    }

    static calcAcceleration(netForce: Vector2D, mass: number) {
        return netForce.div(mass);
    }

    static calcVelocity(currentVelocity: Vector2D, acceleration: Vector2D) {
        return currentVelocity.add(acceleration);
    }

    static calcRotationAcceleration(force: number, mass: number) {
        return force / mass;
    }

    static calcRotationVelocity(currentVelocity: number, acceleration: number) {
        return currentVelocity + acceleration;
    }

    static calcReflection(v: Vector2D, normal: Vector2D): Vector2D {
        return v.reflectViaNormal(normal);
    }

    static calcFriction(coeffecient: number, normal: number, velocity: Vector2D) {
        let magnitude = coeffecient * normal;

        let friction = velocity.mult(-1); // Friction applies in the opposite direction of motion.
        friction = friction.normalize();
        friction = friction.mult(magnitude);
        return friction;
    }

    static calcDrag(coeffecient: number, velocity: Vector2D) {
        let magnitude = coeffecient * velocity.magSquared;

        let drag = velocity.mult(-1); // Drag applies in the opposite direction of motion.
        drag = drag.normalize();
        drag = drag.mult(magnitude);

        return drag;
    }

    static calcAverageAcceleration(initialVelocity: Vector2D, finalVelocity: Vector2D, time: number) {
        return finalVelocity.subtract(initialVelocity).div(time);
    }

    static calcAverageSpeed(distance: number, time: number) {
        return distance / time;
    }

    static calcAverageVelocity(initialPosition: Vector2D, finalPosition: Vector2D, time: number) {
        return finalPosition.subtract(initialPosition).div(time);
    }
}