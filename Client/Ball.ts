class Ball extends Character {
    private _opacity = 1;
    private _allowBounce: boolean = true;

    constructor(
        private readonly _radius: number,
        private _color: string,
        position: Vector2D,
        velocity: Vector2D,
        acceleration: Vector2D,
        mass: number,
        maxVelocity: number,
        private _gravityConst: number,
        private _boundary: IBounds,
        private readonly completeCallback: (ball: Ball) => void) {
        super(position, velocity, acceleration, mass, maxVelocity);

        this._maxRotateVelocity = 0.1;
    }

    get radius() { return this._radius; }
    get color() { return this._color; }

    
    updateRotateVelocity(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        //this._rotateAcceleration = this._acceleration.x / 10;
        this.applyRotateForce(this._acceleration.x / 5);

        super.updateRotateVelocity(frame, timestamp, delta);
    }

    update(frame: number, timestamp: DOMHighResTimeStamp, delta: number, characters: Character[]) {
        let origY = this._position.y;

        super.update(frame, timestamp, delta, characters);

        if (!this._allowBounce) {
            this._position.y = origY;
            this._velocity.y = 0;

            if (this._opacity > 0.2)
                this._opacity = Math.max(this._opacity - 0.01, 0);

            if (this._opacity <= 0.2)
                this.completeCallback(this);
        }

        this.checkBoundary();
    }

    //*
    draw(ctx: CanvasRenderingContext2D, frame: number) {
        super.draw(ctx, frame);

        let radiusX = this._radius;
        let radiusY = this._radius;

        ctx.save();

        let polar = new Polar(this._radius, this._rotateRadians);
        let highlightPos = polar.vector;
        highlightPos.add(this.position);

        let gradient = ctx.createRadialGradient(
            highlightPos.x,
            highlightPos.y,
            this._radius * 0.01,
            highlightPos.x,
            highlightPos.y,
            this._radius);

        gradient.addColorStop(0, "#bbbbbb");
        gradient.addColorStop(0.7, this._color);

        ctx.globalAlpha = this._opacity;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = ctx.globalAlpha * 0.7;
        ctx.strokeStyle = "#bbbbbb";
        ctx.ellipse(this.position.x, this.position.y, radiusX * 0.95, radiusY * 0.95, 0, 1 + 0, MathEx.TWO_PI - 0.5);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    /*/
    draw(ctx: CanvasRenderingContext2D, frame: number) {
        super.draw(ctx, frame);

        let radiusX = this._radius;
        let radiusY = this._radius;

        ctx.save();

        ctx.translate(this._position.x, this._position.y);
        ctx.rotate(this._rotateRadians);
        ctx.translate(-this._position.x, -this._position.y);

        let gradient = ctx.createRadialGradient(this.position.x + radiusX, this.position.y, radiusX * 0.01, this.position.x + radiusX, this.position.y, radiusX);
        gradient.addColorStop(0, "#bbbbbb");
        gradient.addColorStop(0.7, this._color);

        ctx.globalAlpha = this._opacity;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = ctx.globalAlpha * 0.7;
        ctx.strokeStyle = "#bbbbbb";
        ctx.ellipse(this.position.x, this.position.y, radiusX * 0.95, radiusY * 0.95, 0, 1 + 0, MathEx.TWO_PI - 0.5);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    //*/

    private checkBoundary() {
        const boundary = this._boundary;

        let leftPenetration = boundary.leftPenetration(this.position.x - this.radius);
        let topPenetration = boundary.topPenetration(boundary.offsetAbove(this.position.y, this.radius));
        let rightPenetration = boundary.rightPenetration(this.position.x + this.radius);
        let bottomPenetration = boundary.bottomPenetration(boundary.offsetBelow(this.position.y, this.radius));

        if (leftPenetration > 0 && this.velocity.x < 0) {
            this.velocity.x *= -1;
            this.position.x = boundary.leftOffset(this.radius);
        }

        if (rightPenetration > 0 && this.velocity.x > 0) {
            this.velocity.x *= -1;
            this.position.x = boundary.rightOffset(this.radius);
        }

        if (topPenetration > 0 && boundary.isUp(this.velocity.y)) {
            this.velocity.y *= -1;
            this.position.y = boundary.topOffset(this.radius);
        }

        if (bottomPenetration > 0 && boundary.isDown(this.velocity.y)) {
            this.velocity.y *= -1;
            this.position.y = boundary.bottomOffset(this.radius);
            const force = Math.abs(this.velocity.y); // TODO: Calculate proper force.

            if (force <= Math.abs(this._gravityConst)) {
                this.velocity.y = 0;
                this._allowBounce = false;
            }
        }
    }
}
