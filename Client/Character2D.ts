﻿class Character2D extends Force {
    private _frictionCoefficient: number = 0.01;
    private _dragCoefficient: number = 0.01;
    private _restitutionCoefficient: number = 0.5;
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

    get frictionCoefficient() { return this._frictionCoefficient; }
    set frictionCoefficient(value) { this._frictionCoefficient = value; }

    get dragCoefficient() { return this._dragCoefficient; }
    set dragCoefficient(value) { this._dragCoefficient = value; }

    get restitutionCoeffecient() { return this._restitutionCoefficient; }
    set restitutionCoeffecient(value) { this._restitutionCoefficient = MathEx.clamp(value, 0, 1); }

    get momentum() { return Physics.calcMomentum(this.mass, this.velocity); }

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

    protected adjustAcceleration() {
        //console.log("**** " + this.getName(this) + " calc acceleration with force: "
        //    + this._appliedForce.x.toFixed(2) + ", " + this._appliedForce.y.toFixed(2));
        this._acceleration = Physics.calcAcceleration(this._appliedForce, this.mass);
    }

    protected adjustVelocity() {
        let newVelocity = Physics.calcVelocity(this.velocity, this.acceleration);

        if (this.maxSpeed < 0 || newVelocity.mag < this.maxSpeed)
            this._velocity = newVelocity;
    }

    protected adjustPosition(velocity: Vector2D, pixelsPerMeter: number) {
        this._position = this._position.add(Physics.toPixels(velocity, pixelsPerMeter));
    }

    protected adjustRotateAcceleration() {
        this._rotateAcceleration = Physics.calcRotationAcceleration(this._appliedRotateForce, this._mass);
    }

    protected adjustRotateVelocity() {
        let newVelocity = Physics.calcRotationVelocity(this.rotateVelocity, this.rotateAcceleration);

        if (Math.abs(newVelocity) < this.maxRotateVelocity)
            this._rotateVelocity = newVelocity;
    }

    preUpdate(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        this.resetParams();
    }

    update(frame: number, now: DOMHighResTimeStamp, timeDelta: number, world: World2D) {
        this.adjustAcceleration();
        this.adjustVelocity();
        this.adjustRotateAcceleration();
        this.adjustRotateVelocity();

        this.adjustPosition(this._velocity.mult(timeDelta), world.pixelsPerMeter);
        this._rotateRadians = MathEx.constrainRadians(this._rotateRadians + this._rotateVelocity * timeDelta);

        this._lastUpdateFrame = frame;
    }

    draw(viewport: Viewport2D, frame: number) {
    }
}
