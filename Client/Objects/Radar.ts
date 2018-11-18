class Radar extends Character2D {
    private _armManager: Polar2D;
    private _armPos: Vector2D | null = null;
    private _rotateVelocityRequested: number;

    constructor(
        position: Vector2D,
        private readonly _radius: number,
        private readonly _color: string,
        rotateVelocity: number) {
        super(position, Vector2D.emptyVector, 0);

        this._maxRotateVelocity = MathEx.TWO_PI;
        this._rotateVelocityRequested = rotateVelocity;
        this._rotateVelocity = rotateVelocity;
        this._width = this._radius * 2;
        this._height = this._width;

        this._armManager = new Polar2D(this._radius * 0.95, 0);
    }

    get radius() { return this._radius; }
    get color() { return this._color; }
    get radians() { return this._armManager.radians; }
    get degrees() { return this._armManager.degrees; }

    get armPos() {
        if (this._armPos === null)
            this._armPos = this._armManager.vector.add(this.position);

        return this._armPos;
    }

    protected createBounds() { return this.createBoundsFromRadius(this.radius); }

    applyForce(force: Force) { }

    protected adjustRotateAcceleration() {
        this._rotateAcceleration = this._rotateVelocityRequested;
        this._rotateVelocity = 0;
    }


    update(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
        super.update(frame, now, elapsedTime, timeScale, world);

        this._armManager = this._armManager.withRadians(this.rotateRadians);
        this._armPos = null;
    }

    draw(viewport: Viewport2D, frame: number) {
        super.draw(viewport, frame);

        const ctx = viewport.ctx;

        ctx.strokeStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, MathEx.TWO_PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.armPos.x, this.armPos.y);
        ctx.stroke();
        ctx.closePath();
    }
}
