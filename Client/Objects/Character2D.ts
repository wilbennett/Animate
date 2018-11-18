class Character2D extends Force {
    private _frictionCoefficient: number = 0.01;
    private _dragCoefficient: number = 0.01;
    private _restitutionCoefficient: number = 0.5;
    private _priorPosition: Vector2D;
    private _priorVelocity: Vector2D;
    protected _lastUpdateFrame: number = -1;
    protected _maxSpeed: number = -1;
    protected _rotateRadians: number = 0;
    protected _rotateAcceleration: number = 0;
    protected _rotateVelocity: number = 0;
    protected _priorRotateVelocity: number = 0;
    protected _maxRotateVelocity: number = 2;
    protected _appliedForce: Vector2D;
    protected _appliedRotateForce: number;
    protected _squashX: number = 1;
    protected _squashY: number = 1;
    private _tag: object;

    constructor(position: Vector2D, protected _velocity: Vector2D, mass: number) {
        super(position, mass);

        this._priorPosition = this.position;
        this._priorVelocity = this._velocity;
        this.resetParams();
    }

    get priorPosition() { return this._priorPosition; }
    get velocity() { return this._velocity; }
    get priorVelocity() { return this._priorVelocity; }

    get maxSpeed() { return this._maxSpeed; }
    set maxSpeed(value) { this._maxSpeed = value; }

    get rotateVelocity() { return this._rotateVelocity; }
    get priorRotateVelocity() { return this._priorRotateVelocity; }
    get rotateRadians() { return this._rotateRadians; }

    get maxRotateVelocity() { return this._maxRotateVelocity; }
    set maxRotateVelocity(value) { this._maxRotateVelocity = value; }

    get rotateAcceleration() { return this._rotateAcceleration; }

    get frictionCoefficient() { return this._frictionCoefficient; }
    set frictionCoefficient(value) { this._frictionCoefficient = value; }

    get dragCoefficient() { return this._dragCoefficient; }
    set dragCoefficient(value) { this._dragCoefficient = value; }

    get restitutionCoefficient() { return this._restitutionCoefficient; }
    set restitutionCoefficient(value) { this._restitutionCoefficient = MathEx.clamp(value, 0, 1); }

    get momentum() { return Physics.calcMomentum(this.mass, this.velocity); }

    get squashX() { return this._squashX; }
    set squashX(value) { this._squashX = value; }

    get squashY() { return this._squashY; }
    set squashY(value) { this._squashY = value; }

    get tag() { return this._tag; }
    set tag(value) { this._tag = value; }

    applyForce(force: Force) {
        //if (this.getName(force) !== "Gravity")
        //console.log(this.getName(this) + " applying force from " + this.getName(force) + ": "
        //    + this._appliedForce + "  :  " + force.force + " : CoR " + this.restitutionCoefficient);
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

    protected adjustAcceleration() {
        //console.log("**** " + this.getName(this) + " calc acceleration with force: "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2));
        this._acceleration = Physics.calcAcceleration(this._appliedForce, this.mass);
    }

    /*
    // Using standard formulae. Needs gravity scaled to work properly.
    // Has velocity artifacts when trying to scale time to seconds. Need to investigate.
    // Currently broken with time in seconds scale.
    protected adjustVelocity() {
        let newVelocity = Physics.calcVelocity(this.velocity, this.acceleration);

        if (this.maxSpeed < 0 || newVelocity.mag < this.maxSpeed)
            this._velocity = newVelocity;
    }

    protected adjustPosition(velocity: Vector2D, pixelsPerMeter: number) {
        velocity = Physics.toPixels(velocity, pixelsPerMeter);
        this.position = this.position.add(velocity);
    }

    update(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
        this.adjustAcceleration();
        this.adjustVelocity();
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity();

        this.adjustPosition(this.velocity.mult(timeScale), world.pixelsPerMeter);
        this.adjustRotateAngle(this.rotateVelocity * timeScale);
    }
    /*/
    // Using displacement. Takes care of time differences and the need to scale gravity when working in seconds.
    protected adjustVelocity(elapsedTime: number) {
        let newVelocity = Physics.calcFinalVelocity(elapsedTime, this.priorVelocity, this.acceleration);

        if (this.maxSpeed < 0 || newVelocity.mag < this.maxSpeed)
            this._velocity = newVelocity;
    }

    protected adjustPosition(elapsedTime: number, pixelsPerMeter: number) {
        let displacement = Physics.calcDisplacement(elapsedTime, this.priorVelocity, this.acceleration);
        displacement = Physics.toPixels(displacement, pixelsPerMeter);
        this.position = this.position.add(displacement);
    }

    //protected adjustRotateVelocity(elapsedTime: number) {
    //    let newVelocity = Physics.calcFinalRotationVelocity(elapsedTime, this.priorRotateVelocity, this.rotateAcceleration);

    //    if (Math.abs(newVelocity) < this.maxRotateVelocity)
    //        this._rotateVelocity = newVelocity;
    //}

    //protected adjustRotateAngle(elapsedTime: number) {
    //    let displacement = Physics.calcRotationDisplacement(elapsedTime, this.priorRotateVelocity, this.rotateAcceleration);
    //    this._rotateRadians = this.rotateRadians + displacement;
    //    this._rotateRadians = MathEx.constrainRadians(this.rotateRadians);
    //}

    update(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
        this.adjustAcceleration();
        this.adjustVelocity(elapsedTime);
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity();

        this.adjustPosition(elapsedTime, world.pixelsPerMeter);
        this.adjustRotateAngle(this.rotateVelocity * timeScale);
    }
    //*/

    protected adjustRotateAcceleration() {
        this._rotateAcceleration = Physics.calcRotationAcceleration(this._appliedRotateForce, this.mass);
    }

    protected adjustRotateVelocity() {
        let newVelocity = Physics.calcRotationVelocity(this.rotateVelocity, this.rotateAcceleration);

        if (Math.abs(newVelocity) < this.maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    }

    protected adjustRotateAngle(rotateVelocity: number) {
        this._rotateRadians = MathEx.constrainRadians(this.rotateRadians + rotateVelocity);
    }

    preUpdate(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
        this.resetParams();
    }

    postUpdate(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
        this._priorPosition = this.position;
        this._priorVelocity = this.velocity;
        this._priorRotateVelocity = this.rotateVelocity;
        this._lastUpdateFrame = frame;
    }

    draw(viewport: Viewport2D, frame: number) {
        //const ctx = viewport.ctx;

        //ctx.beginPath();
        //ctx.strokeStyle = "black";
        //ctx.lineWidth = 2;
        //ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        //ctx.stroke();
    }
}
