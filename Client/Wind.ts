﻿class Wind extends Character {
    private _polar: Polar2D;
    private _radiusPct: number = 0.10;

    constructor(
        position: Vector2D,
        degrees: number,
        strength: number) {
        super(position, Vector2D.emptyVector, 0);

        this._polar = new Polar2D(strength, MathEx.toRadians(degrees));
        this.polarUpdated();
    }

    get degrees() { return this._polar.degrees; }
    set degrees(value: number) { this.radians = MathEx.toRadians(value); }

    get radians() { return this._polar.radians; }

    set radians(value: number) {
        this._polar = this._polar.withRadians(value);
        this.polarUpdated();
    }

    get strength() { return this._polar.radius; }

    set strength(value: number) {
        this._polar = new Polar2D(value, this.radians);
        this.polarUpdated();
    }

    private polarUpdated() {
        this._velocity = Vector2D.normalize(this._polar.vector);
    }

    calculateForce() { }

    protected calculateForceForCharacter(character: Character) {
        this._force = Vector2D.emptyVector;
        let pos = Vector2D.subtract(character.position, this.position);

        if (pos.mag > this._polar.radius) return;

        this._force = Vector2D.mult(this._velocity, pos.magSquared * 0.01);
        this._force = this._force.div(character.velocity.mag);
    }

    update(frame: number, timestamp: DOMHighResTimeStamp, delta: number, characters: Character[]) {
        //super.update(frame, timestamp, delta, characters);

        this._radiusPct = (this._radiusPct + 0.01) % 0.9 + 0.10;
    }

    draw(ctx: CanvasRenderingContext2D, frame: number) {
        let origAlpha = ctx.globalAlpha;

        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, 10, 10, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = "purple";
        ctx.fill();
        ctx.closePath();

        let v = Vector2D.mult(this._velocity, this._polar.radius * 0.5);
        v = v.add(this._position);
        ctx.beginPath();
        ctx.strokeStyle = "purple";
        ctx.moveTo(this._position.x, this._position.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = 0.6;
        ctx.globalAlpha = this._radiusPct;
        ctx.arc(this.position.x, this.position.y, this._polar.radius * this._radiusPct, 0, MathEx.TWO_PI);
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath();

        ctx.globalAlpha = origAlpha;
    }
}
