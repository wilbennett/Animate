class Character extends Force {
    private _universalForces: Force[] = [];
    protected _frictionCoeffecient: number = 0.01;
    protected _lastUpdateFrame: number = -1;
    protected _rotateRadians: number = 0;
    protected _rotateVelocity: number = 0;
    protected _rotateAcceleration: number = 0;
    protected _maxRotateVelocity: number = 2;
    protected _appliedForce: Vector2D;
    protected _appliedRotateForce: number;
    protected _squashX: number = 1;
    protected _squashY: number = 1;

    constructor(
        position: Vector2D,
        protected _velocity: Vector2D,
        protected _acceleration: Vector2D,
        protected readonly _mass: number,
        protected _maxVelocity: number) {
        super(position, new Vector2D(0, 0), 0);
    }

    get position() { return this._position; }
    set position(value) { this._position = value; }

    get velocity() { return this._velocity; }

    get maxVelocity() { return this._maxVelocity; }
    set maxVelocity(value) { this._maxVelocity = value; }

    get acceleration() { return this._acceleration; }

    get rotateVelocity() { return this._rotateVelocity; }

    get maxRotateVelocity() { return this._maxRotateVelocity; }
    set maxRotateVelocity(value) { this._maxRotateVelocity = value; }

    get rotateAcceleration() { return this._rotateAcceleration; }

    get mass() { return this._mass; }

    get frictionCoeffecient() { return this._frictionCoeffecient; }
    set frictionCoeffecient(value) { this._frictionCoeffecient = value; }

    get squashX() { return this._squashX; }
    set squashX(value) { this._squashX = value; }

    get squashY() { return this._squashY; }
    set squashY(value) { this._squashY = value; }

    addUniversalForce(force: Force) { this._universalForces.push(force); }

    removeUniversalForce(force: Force) {
        let index = this._universalForces.indexOf(force);

        if (index > -1) {
            this._universalForces.splice(index, 1);
        }
    }

    applyForce(force: Vector2D) {
        this._appliedForce = this._appliedForce.add(force);
        //let a = Physics.calcAcceleration(force, this._mass);
        //this._acceleration = this._acceleration.add(a);
    }

    applyRotateForce(force: number) {
        this._appliedRotateForce = this._appliedRotateForce + force;
        //let a = Physics.calcRotationAcceleration(force, this._mass);
        //this._rotateAcceleration += a;
    }

    applyUniversalForces() { this._universalForces.forEach((f, i, fs) => f.applyForceTo(this)); }

    preUpdate(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        this._appliedForce = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
        this._appliedRotateForce = 0;
        this._rotateAcceleration = 0;
    }

    adjustAcceleration() {
        this._acceleration = Physics.calcAcceleration(this._appliedForce, this.mass);
    }

    adjustVelocity(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        let newVelocity = Physics.calcVelocity(this.velocity, this.acceleration);

        if (newVelocity.mag < this.maxVelocity)
            this._velocity = newVelocity;
    }

    adjustPosition(velocity: Vector2D) {
        this._position = this._position.add(Physics.toPixels(velocity));
    }

    adjustRotateAcceleration() {
        this._rotateAcceleration = Physics.calcRotationAcceleration(this._appliedRotateForce, this._mass);
    }

    adjustRotateVelocity(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        let newVelocity = Physics.calcRotationVelocity(this.rotateVelocity, this.rotateAcceleration);

        if (Math.abs(newVelocity) < this.maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    }

    update(frame: number, now: DOMHighResTimeStamp, delta: number, characters: Character[]) {
        this.applyUniversalForces();
        this.adjustAcceleration();
        this.adjustVelocity(frame, now, delta);
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity(frame, now, delta);

        this.adjustPosition(this._velocity.mult(delta));
        this._rotateRadians += this._rotateVelocity * delta;
        this._rotateRadians = this._rotateRadians % MathEx.TWO_PI;

        this._lastUpdateFrame = frame;
    }

    draw(ctx: CanvasRenderingContext2D, frame: number) {
    }
}
