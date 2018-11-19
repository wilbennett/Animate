class Ball extends Character2D {
    private _opacity = 1;
    private _allowBounce: boolean = true;

    constructor(
        private readonly _radius: number,
        private _color: string,
        position: Vector2D,
        velocity: Vector2D,
        mass: number,
        private _boundary: ContainerBounds,
        private readonly completeCallback: (ball: Ball) => void,
        restitution?: number) {
        super(position, velocity, mass);

        if (!restitution) restitution = 0.98;

        this.restitutionCoefficient = restitution;

        this._width = this._radius * 2;
        this._height = this._width;
        this._maxRotateVelocity = MathEx.toRadians(360);
    }

    get radius() { return this._radius; }
    get color() { return this._color; }

    
    protected createBounds() { return this.createBoundsFromRadius(this.radius); }

    protected adjustRotateAcceleration() {
        this.applyRotateForce(this.acceleration.x * 1);

        super.adjustRotateAcceleration();
    }

    update(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
        let origY = this.position.y;

        super.update(frame, now, elapsedTime, timeScale, world);

        if (!this._allowBounce) {
            this.position = this.position.withY(origY);
            this._velocity = this.velocity.withY(0);

            if (this._opacity > 0.2)
                this._opacity = Math.max(this._opacity - 0.01, 0);

            if (this._opacity <= 0.2)
                this.completeCallback(this);
        }

        this.checkBoundary(world.gravity);
    }

    private priorUp = false;
    private priorY: number;
    private highY: number;

    //*
    draw(viewport: Viewport2D, frame: number) {
        super.draw(viewport, frame);

        const ctx = viewport.ctx;
        let ballStrokeColor = "#bbbbbb";
        let ballStrokeWidth = 1;

        /*
        let isUp = this._boundary.isUp(this.velocity.y);
        let isDown = this._boundary.isDown(this.velocity.y);
        let highColor = "black";

        if (this.priorUp && isDown) {
            this.highY = this.priorY;
        }

        if (this._boundary.isAbove(this.position.y, this.highY)) {
            this.highY = this.position.y;
            highColor = "white";
        }

        //if (this.velocity.mag > this.priorVelocity.mag) {
        if (this.velocity.withY(0).mag > this.priorVelocity.withY(0).mag) {
            ballStrokeColor = "yellow";
            ballStrokeWidth = 4;
        }

        this.priorY = this.position.y;
        this.priorUp = isUp;
        //*/

        let radiusX = this.radius;
        let radiusY = this.radius;

        let highlightPos = Vector2D.fromRadians(this.rotateRadians).mult(this.radius);
        highlightPos = highlightPos.add(this.position);

        let gradient = ctx.createRadialGradient(
            highlightPos.x,
            highlightPos.y,
            this.radius * 0.01,
            highlightPos.x,
            highlightPos.y,
            this.radius);

        gradient.addColorStop(0, "#bbbbbb");
        gradient.addColorStop(0.7, this._color);

        ctx.save();

        ctx.globalAlpha = this._opacity;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = ctx.globalAlpha * 0.7;
        ctx.strokeStyle = ballStrokeColor;
        ctx.lineWidth = ballStrokeWidth;
        ctx.ellipse(this.position.x, this.position.y, radiusX * 0.95, radiusY * 0.95, 0, 1 + 0, MathEx.TWO_PI - 0.5);
        ctx.stroke();
        ctx.closePath();

        /*
        ctx.beginPath();
        ctx.strokeStyle = highColor;
        ctx.lineWidth = 2;
        let y = this._boundary.offsetAbove(this.highY, this.radius);
        ctx.moveTo(this.position.x - this.radius * 2, y);
        ctx.lineTo(this.position.x + this.radius * 2, y);
        ctx.stroke();
        //*/

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

    private priorPreV: number = 0;

    private checkBoundary(gravity: Gravity) {
        const boundary = this._boundary;
        let reflectVelocity: Vector2D | null = null;
        let priorVelocity = this.priorVelocity;

        let leftPenetration = boundary.leftPenetration(this.position.x - this.radius);
        let topPenetration = boundary.topPenetration(boundary.offsetAbove(this.position.y, this.radius));
        let rightPenetration = boundary.rightPenetration(this.position.x + this.radius);
        let bottomPenetration = boundary.bottomPenetration(boundary.offsetBelow(this.position.y, this.radius));

        // TODO: Reflecting with prior velocity.  Need to get the velocity at time of impact.

        if (leftPenetration > 0) {
            this.position = this.position.withX(boundary.leftOffset(this.radius));
            reflectVelocity = boundary.reflectLeft(priorVelocity);
            reflectVelocity = reflectVelocity.withX(reflectVelocity.x * this.restitutionCoefficient);
        }
        else if (rightPenetration > 0) {
            this.position = this.position.withX(boundary.rightOffset(this.radius));
            reflectVelocity = boundary.reflectRight(priorVelocity);
            reflectVelocity = reflectVelocity.withX(reflectVelocity.x * this.restitutionCoefficient);
        }

        if (reflectVelocity)
            priorVelocity = reflectVelocity;

        if (topPenetration > 0) {
            this.position = this.position.withY(boundary.topOffsetBelow(this.radius));
            reflectVelocity = boundary.reflectTop(priorVelocity);
            reflectVelocity = reflectVelocity.withY(reflectVelocity.y * this.restitutionCoefficient);
        }
        else if (bottomPenetration > 0) {
            let preV = this.velocity.mag;
            //if (preV > this.priorPreV) console.log("####################################################");
            this.priorPreV = preV;
            this.position = this.position.withY(boundary.bottomOffsetAbove(this.radius));
            reflectVelocity = boundary.reflectBottom(priorVelocity);
            reflectVelocity = reflectVelocity.withY(reflectVelocity.y * this.restitutionCoefficient);
            let postV = reflectVelocity.mag;
            //console.log("Pre bounce: " + preV.toFixed(2) + ", post bounce: " + postV.toFixed(2) + " " + reflectVelocity + ", " + (preV - postV).toFixed(2));

            if (Math.abs(reflectVelocity.y) < 0.01) {
                reflectVelocity = reflectVelocity.withY(0);
                this._allowBounce = false;
            }
        }

        if (reflectVelocity)
            this._velocity = reflectVelocity;
    }
}
