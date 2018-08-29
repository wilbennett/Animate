class Physics {
    static calcAcceleration(force: Vector, mass: number) {
        return Vector.div(force, mass);
    }

    static calcVelocity(currentVelocity: Vector, acceleration: Vector) {
        return Vector.add(currentVelocity, acceleration);
    }

    static calcRotationAcceleration(force: number, mass: number) {
        return force / mass;
    }

    static calcRotationVelocity(currentVelocity: number, acceleration: number) {
        return currentVelocity + acceleration;
    }

    static calcFriction(coeffecient: number, normal: number, velocity: Vector) {
        let c = coeffecient;
        let magnitude = c * normal;

        let friction = Vector.mult(velocity, -1); // Friction applies in the opposite direction of motion.
        friction.normalize();
        friction.mult(magnitude);
        return friction;
    }

    static calcDrag(coeffecient: number, velocity: Vector) {
        let c = coeffecient;
        let magnitude = c * velocity.magSquared;

        let drag = Vector.mult(velocity, -1); // Drag applies in the opposite direction of motion.
        drag.normalize();
        drag.mult(magnitude);

        return drag;
    }
}