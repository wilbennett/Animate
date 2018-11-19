class Physics {
    /* // Use with standard velocity formula.
    static readonly pixelsPerMeter = 2;//0.1; 
    static readonly gravityScale = 1;//0.01;
    /*/
    static readonly pixelsPerMeter = 70;
    static readonly gravityScale = 1;
    //*/
    static readonly gravitySun = 274;
    static readonly gravityJupiter = 24.92;
    static readonly gravityNeptune = 11.15;
    static readonly gravitySaturn = 10.44;
    static readonly gravityEarth = 9.798;
    static readonly gravityUranus = 8.87;
    static readonly gravityVenus = 8.87;
    static readonly gravityMars = 3.71;
    static readonly gravityMercury = 3.7;
    static readonly gravityMoon = 1.62;
    static readonly gravityPluto = 0.58;

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

    static calcWindForce(density: number, area: number, velocity: Vector2D) {
        // air mass (Am) = density * area
        // acceleration (a) = windspeed * windspeed
        // F = Am * a
        let airMass = density * area;
        let acceleration = velocity.magSquared;
        let magnitude = airMass * acceleration;
        let force = velocity.normalizeMult(magnitude);

        return force;
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

    static calcFinalVelocity(time: number, initialVelocity: Vector2D, acceleration: Vector2D) {
        // Vf = Vi + a * t
        return initialVelocity.add(acceleration.mult(time));
    }

    static calcDisplacement(time: number, initialVelocity: Vector2D, acceleration: Vector2D) {
    	// d = Vi * t + (a * t * t) / 2
        let velocityTime = initialVelocity.mult(time);
        let halfAccelerationTime = acceleration.mult(time * time).div(2);
        return velocityTime.add(halfAccelerationTime);
    }

    static calcRotationAcceleration(force: number, mass: number) {
        // a = f / m
        return mass === 0 ? 0 : force / mass;
    }

    static calcRotationVelocity(currentVelocity: number, acceleration: number) {
        // v = v + a;
        return currentVelocity + acceleration;
    }

    static calcFinalRotationVelocity(time: number, initialVelocity: number, acceleration: number) {
        // Vf = Vi + a * t
        return initialVelocity + acceleration * time;
    }

    static calcRotationDisplacement(time: number, initialVelocity: number, acceleration: number) {
        // d = Vi * t + (a * t * t) / 2
        let velocityTime = initialVelocity * time;
        let halfAccelerationTime = acceleration * time * time / 2;
        return velocityTime + halfAccelerationTime;
    }

    static calcReflection(v: Vector2D, normal: Vector2D): Vector2D {
        return v.reflectViaNormal(normal);
    }

    static calcFriction(coeffecient: number, normal: Vector2D, velocity: Vector2D) {
        // F = -1 * c * N * vNormal
        let magnitude = coeffecient * normal.mag;
        let friction = velocity.normalizeMult(-magnitude); // Friction applies in the opposite direction of motion.
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