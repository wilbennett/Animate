class Radar extends Character {
    private _armManager: Polar2D;
    private _armPos: Vector2D | null = null;

    constructor(
        position: Vector2D,
        private _radius: number,
        private _color: string,
        private _angleVelocity: number) {
        super(position, Vector2D.empty, Vector2D.empty, 0, 0);

        this._armManager = new Polar2D(this._radius * 0.95, 0);
    }

    get radius() { return this._radius; }
    get color() { return this._color; }
    get radians() { return this._armManager.radians; }
    get degrees() { return this._armManager.degrees; }

    get armPos() {
        if (this._armPos === null)
            this._armPos = this._armManager.vector.add(this._position);

        return this._armPos;
    }

    updateRotateVelocity(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        this._armManager = this._armManager.addRadians(this._angleVelocity * delta);
        this._armPos = null;
    }

    draw(ctx: CanvasRenderingContext2D, frame: number) {
        super.draw(ctx, frame);

        ctx.strokeStyle = this._color;

        ctx.beginPath();
        ctx.arc(this._position.x, this._position.y, this._radius, 0, MathEx.TWO_PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this._position.x, this._position.y);
        ctx.lineTo(this.armPos.x, this.armPos.y);
        ctx.stroke();
        ctx.closePath();
    }
}
