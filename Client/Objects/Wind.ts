class Wind extends Character2D {
    private _decayRate: number = 0.039;
    private _minValue: number = 0.01;
    private _radiusPct: number = 0.10;
    private _oppositeVelocityDir: Vector2D;
    private _baseLine: Line2D;
    private _leftLine: Line2D;
    private _rightLine: Line2D;
    private _frontLine: Line2D;

    constructor(speed: number, degrees: number, position: Vector2D, private readonly _radius: number) {
        super(position, Vector2D.fromDegrees(degrees).mult(speed), 0);

        this._width = this._radius * 2;
        this._height = this._width;
        this.createBoundary();
        this.logDecayTime();
    }

    logDecayTime() {
        let decayTime = MathEx.calcDecayTime(this.speed, this._decayRate, this._minValue);
        decayTime = Math.abs(decayTime);
        console.log("speed: " + this.speed + ", rate: " + this._decayRate + ".  Distance to " + this._minValue.toFixed(2) + ": " + decayTime.toFixed(2));
        console.log(MathEx.calcDecay(this.speed, this._decayRate, decayTime).toFixed(2));

        for (var i = 0; i < decayTime; i += 15)
        {
            console.log(i + ": " + MathEx.calcDecay(this.speed, this._decayRate, i).toFixed(2));
        }
    }

    get degrees() { return this.velocity.degrees; }
    set degrees(value: number) { this._velocity = Vector2D.fromDegrees(value).mult(this.velocity.mag); }

    get radians() { return this.velocity.radians; }
    set radians(value: number) { this._velocity = Vector2D.fromRadians(value).mult(this.velocity.mag); }

    get speed() { return this.velocity.mag; }
    set speed(value: number) {
        this._velocity = this.velocity.normalizeMult(value);
        this.createBoundary();
        this.logDecayTime();
    }

    protected createBounds() { return this.createBoundsFromRadius(this._radius); }

    private intersectsWithPoint(point: Vector2D) {
        let pointRay = new Ray2D(point, this.position);

        return !pointRay.getInstersection(this._frontLine)
            && !pointRay.getInstersection(this._leftLine)
            && !pointRay.getInstersection(this._rightLine)
            && !pointRay.getInstersection(this._baseLine);
    }

    intersectsWithCharacter(character: Character2D) {
        let bounds = character.bounds;

        // NOTE: Does not consider where the edges overlap but no corner is inside.
        return this.intersectsWithPoint(bounds.topLeft)
            || this.intersectsWithPoint(bounds.bottomLeft)
            || this.intersectsWithPoint(bounds.bottomRight)
            || this.intersectsWithPoint(bounds.topRight);
    }

    calculateForce() { }

    calculateForceForCharacter(character: Character2D): Vector2D {
        let pos = character.position.subtract(this.position);

        if (pos.mag > this._radius) return Vector2D.emptyVector;

        let force = this._velocity.mult(pos.magSquared * 0.01);
        return force.div(character.velocity.mag);
    }

    update(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
        //super.update(frame, now, elapsedTime, timeScale, world);

        this._radiusPct = (this._radiusPct + 0.01) % 0.9 + 0.10;
    }

    createBoundary() {
        this._oppositeVelocityDir = this.velocity.normalizeMult(-1);
        let position = this.position.add(this._oppositeVelocityDir);
        let distToTarget = Math.abs(MathEx.calcDecayTime(this.speed, this._decayRate, this._minValue));
        let radiusVector = this.velocity.normalizeMult(this._radius);
        let baseStart = radiusVector.rotateDegrees(90).add(position);
        let baseEnd = radiusVector.rotateDegrees(-90).add(position);
        this._baseLine = new Line2D(baseStart, baseEnd);
        this._leftLine = new Line2D(baseStart, this.velocity, distToTarget);
        this._rightLine = new Line2D(baseEnd, this.velocity, distToTarget);
        this._frontLine = new Line2D(this._rightLine.endPoint, this._leftLine.endPoint);
    }

    draw(viewport: Viewport2D, frame: number) {
        super.draw(viewport, frame);
        const ctx = viewport.ctx;
        let origAlpha = ctx.globalAlpha;
        let startRadians = MathEx.toRadians(this.velocity.degrees - 90);
        let endRadians = MathEx.toRadians(this.velocity.degrees + 90);

        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, 10, 10, 0, startRadians, endRadians);
        ctx.fillStyle = "purple";
        ctx.fill();
        ctx.closePath();

        let v = this._velocity.normalizeMult(this._radius * 0.5);
        v = v.add(this.position);
        ctx.beginPath();
        ctx.strokeStyle = "purple";
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = 0.6;
        ctx.globalAlpha = this._radiusPct;
        let radiusX = this._radius * this._radiusPct;
        let radiusY = radiusX;
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, startRadians, endRadians);
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath();

        ctx.globalAlpha = origAlpha;

        this._baseLine.draw(ctx, 2, "white");
        this._leftLine.draw(ctx, 2, "black");
        this._rightLine.draw(ctx, 2, "green");
        this._frontLine.draw(ctx, 2, "purple");

        let dist = 0;
        let pos = this.world.offsetAbove(this.position.y, dist + 15);
        let speed = this.speed;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.velocity.radians);
        ctx.translate(-this.position.x, -this.position.y);
        //ctx.translate(0, this.position.y + (this.world.screenHeight - 1) / 3);
        //ctx.scale(1, -1);
        ctx.font = "12px Arial";

        while (speed > this._minValue) {
            speed = MathEx.calcDecay(this.speed, this._decayRate, dist);
            ctx.fillText(speed.toFixed(2), this.position.x + 15, pos);
            dist += 15;
            pos = this.world.offsetAbove(this.position.y, dist + 15);
        }
        ctx.restore();

        this.world.characters.forEach(character => {
            if (this.intersectsWithCharacter(character)) {
                let charRay = new Ray2D(character.position, this.position);
                charRay.draw(ctx, 1, "yellow");
            }
        }, this);
    }
}
