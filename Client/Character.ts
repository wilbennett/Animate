class Character extends Force {
    private _universalForces: Force[] = [];
    protected _frictionCoeffecient: number = 0.01;
    protected _lastUpdateFrame: number = -1;
    protected _rotateRadians: number = 0;
    protected _rotateVelocity: number = 0;
    protected _rotateAcceleration: number = 0;
    protected _maxRotateVelocity: number = 2;
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
    set velocity(value) { this._velocity = value; }

    get maxVelocity() { return this._maxVelocity; }
    set maxVelocity(value) { this._maxVelocity = value; }

    get acceleration() { return this._acceleration; }
    set acceleration(value) { this._acceleration = value; }

    get rotateVelocity() { return this._rotateVelocity; }
    set rotateVelocity(value) { this._rotateVelocity = value; }

    get maxRotateVelocity() { return this._maxRotateVelocity; }
    set maxRotateVelocity(value) { this._maxRotateVelocity = value; }

    get rotateAcceleration() { return this._rotateAcceleration; }
    set rotateAcceleration(value) { this._rotateAcceleration = value; }

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
        let a = Physics.calcAcceleration(force, this._mass);
        this._acceleration.add(a);
    }

    applyRotateForce(force: number) {
        let a = Physics.calcRotationAcceleration(force, this._mass);
        this._rotateAcceleration += a;
    }

    applyUniversalForces() { this._universalForces.forEach((f, i, fs) => f.applyTo(this)); }

    updateVelocity(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        let newVelocity = Physics.calcVelocity(this._velocity, this._acceleration);

        if (newVelocity.mag < this._maxVelocity)
            this._velocity = newVelocity;
    }

    updateRotateVelocity(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        let newVelocity = Physics.calcRotationVelocity(this._rotateVelocity, this._rotateAcceleration);

        if (Math.abs(newVelocity) < this._maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    }

    preUpdate(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        this._acceleration = new Vector2D(0, 0);
        this._rotateAcceleration = 0;
    }

    update(frame: number, timestamp: DOMHighResTimeStamp, delta: number, characters: Character[]) {
        this.applyUniversalForces();
        this.updateVelocity(frame, timestamp, delta);
        this.updateRotateVelocity(frame, timestamp, delta);

        this._position.add(Vector2D.mult(this._velocity, delta));
        this._rotateRadians += this._rotateVelocity * delta;
        this._rotateRadians = this._rotateRadians % MathEx.TWO_PI;

        this._lastUpdateFrame = frame;
    }

    draw(ctx: CanvasRenderingContext2D, frame: number) {
    }
}
