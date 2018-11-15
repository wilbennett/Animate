class Character extends Force {
    protected _frictionCoeffecient: number = 0.01;
    protected _lastUpdateFrame: number = -1;
    protected _maxSpeed: number = -1;
    protected _rotateRadians: number = 0;
    protected _rotateVelocity: number = 0;
    protected _rotateAcceleration: number = 0;
    protected _maxRotateVelocity: number = 2;
    protected _appliedForce: Vector2D;
    protected _appliedRotateForce: number;
    protected _squashX: number = 1;
    protected _squashY: number = 1;

    constructor(position: Vector2D, protected _velocity: Vector2D, mass: number) {
        super(position, mass);

        this.resetParams();
    }

    get velocity() { return this._velocity; }

    get maxSpeed() { return this._maxSpeed; }
    set maxSpeed(value) { this._maxSpeed = value; }

    get rotateVelocity() { return this._rotateVelocity; }

    get maxRotateVelocity() { return this._maxRotateVelocity; }
    set maxRotateVelocity(value) { this._maxRotateVelocity = value; }

    get rotateAcceleration() { return this._rotateAcceleration; }

    get frictionCoeffecient() { return this._frictionCoeffecient; }
    set frictionCoeffecient(value) { this._frictionCoeffecient = value; }

    get squashX() { return this._squashX; }
    set squashX(value) { this._squashX = value; }

    get squashY() { return this._squashY; }
    set squashY(value) { this._squashY = value; }

    applyForce(force: Force) {
        //console.log(this.getName(this) + " applying force from " + this.getName(force) + ": "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2) + "  :  "
        //    + force.force.x.toFixed(2) + ", " + force.force.y.toFixed(2));
        this._appliedForce = this._appliedForce.add(force.force);
    }

    applyRotateForce(force: number) {
        this._appliedRotateForce = this._appliedRotateForce + force;
    }

    resetParams() {
        this._appliedForce = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
        this._appliedRotateForce = 0;
        this._rotateAcceleration = 0;
    }

    preUpdate(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        this.resetParams();
    }

    adjustAcceleration() {
        //console.log("**** " + this.getName(this) + " calc acceleration with force: "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2));
        this._acceleration = Physics.calcAcceleration(this._appliedForce, this.mass);
    }

    adjustVelocity() {
        let newVelocity = Physics.calcVelocity(this.velocity, this.acceleration);

        if (this.maxSpeed < 0 || newVelocity.mag < this.maxSpeed)
            this._velocity = newVelocity;
    }

    adjustPosition(velocity: Vector2D) {
        this._position = this._position.add(Physics.toPixels(velocity));
    }

    adjustRotateAcceleration() {
        this._rotateAcceleration = Physics.calcRotationAcceleration(this._appliedRotateForce, this._mass);
    }

    adjustRotateVelocity() {
        let newVelocity = Physics.calcRotationVelocity(this.rotateVelocity, this.rotateAcceleration);

        if (Math.abs(newVelocity) < this.maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    }

    update(frame: number, now: DOMHighResTimeStamp, timeDelta: number, characters: Character[]) {
        this.adjustAcceleration();
        this.adjustVelocity();
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity();

        this.adjustPosition(this._velocity.mult(timeDelta));
        this._rotateRadians = MathEx.constrainRadians(this._rotateRadians + this._rotateVelocity * timeDelta);

        this._lastUpdateFrame = frame;
    }

    draw(ctx: CanvasRenderingContext2D, frame: number) {
    }
}
