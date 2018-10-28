class Physics {
    static calcAcceleration(force: Vector2D, mass: number) {
        return Vector2D.div(force, mass);
    }

    static calcVelocity(currentVelocity: Vector2D, acceleration: Vector2D) {
        return Vector2D.add(currentVelocity, acceleration);
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
        let c = coeffecient;
        let magnitude = c * normal;

        let friction = Vector2D.mult(velocity, -1); // Friction applies in the opposite direction of motion.
        friction.normalize();
        friction.mult(magnitude);
        return friction;
    }

    static calcDrag(coeffecient: number, velocity: Vector2D) {
        let c = coeffecient;
        let magnitude = c * velocity.magSquared;

        let drag = Vector2D.mult(velocity, -1); // Drag applies in the opposite direction of motion.
        drag.normalize();
        drag.mult(magnitude);

        return drag;
    }
}