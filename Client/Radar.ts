﻿class Radar extends Character {
    private _armManager: Polar2D;
    private _armPos: Vector2D | null = null;

    constructor(
        position: Vector2D,
        private readonly _radius: number,
        private readonly _color: string,
        rotateVelocity: number) {
        super(position, Vector2D.emptyVector, Vector2D.emptyVector, 0, 0);

        this._rotateVelocity = rotateVelocity;
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

    applyForce(force: Vector2D) { }
    applyRotateForce(force: number) { }

    update(frame: number, now: DOMHighResTimeStamp, timeDelta: number, characters: Character[]) {
        super.update(frame, now, timeDelta, characters);

        this._armManager = this._armManager.withRadians(this._rotateRadians);
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
