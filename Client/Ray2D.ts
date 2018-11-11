class Ray2D {
    private readonly _direction: Vector2D;
    private readonly _endPoint: Vector2D;

    constructor(private readonly _origin: Vector2D, direction: Vector2D, private readonly _length: number) {
        this._direction = direction.normalize();

        this._endPoint = this.getPointAt(this._length);
    }

    get origin() { return this._origin; }
    get direction() { return this._direction; }
    get length() { return this._length; }
    get endPoint() { return this._endPoint; }
    get normal() { return this.direction.normal; }

    getPointAt(length: number): Vector2D {
        //console.log(`Origin (${this.origin.x}, ${this.origin.y}) - Direction (${this.direction.x}, ${this.direction.y})`);
        let result = Vector2D.mult(length, this.direction);
        return result.add(this.origin);
    }

    radiansBetween(target: Ray2D): number { return this.direction.radiansBetween(target.direction); }
    degreesBetween(target: Ray2D): number { return MathEx.toDegrees(this.radiansBetween(target)); }

    rotateRadians(angle: number): Ray2D {
        return new Ray2D(this.origin, this.direction.rotateRadians(angle), this.length);
    }

    rotateDegrees(angle: number): Ray2D {
        return this.rotateRadians(MathEx.toRadians(angle));
    }

    rotateRadiansAbout(angle: number, center: Vector2D): Ray2D {
        let newOrigin = this.origin.rotateRadiansAbout(angle, center);
        return new Ray2D(
            newOrigin,
            newOrigin.directionTo(this.endPoint.rotateRadiansAbout(angle, center)),
            this.length);
    }

    rotateDegreesAbout(angle: number, center: Vector2D): Ray2D {
        return this.rotateRadiansAbout(MathEx.toRadians(angle), center);
    }

    reflectViaNormal(normal: Vector2D): Ray2D {
        let reflection = this.direction.reflectViaNormal(normal);
        return new Ray2D(this.endPoint, reflection, this.length);
    }

    reflectOff(reflector: Ray2D): Ray2D {
        return this.reflectViaNormal(reflector.normal);
    }

    reflect(source: Ray2D): Ray2D {
        return source.reflectViaNormal(this.normal);
    }

    protected drawLine(ctx: CanvasRenderingContext2D, lineWidth: number, color: string, bounds?: OrientedBounds): void {
        let origin = this.origin;
        let endPoint = this.endPoint;

        if (bounds) {
            origin = bounds.toScreen(origin);
            endPoint = bounds.toScreen(endPoint);
            lineWidth = lineWidth * Math.max(bounds.boundsToScreenScaleX, bounds.boundsToScreenScaleY);
        }

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        //console.log(`length: ${length}  - (${this.origin.x}, ${this.origin.y}) -> (${this._endPoint.x}, ${this._endPoint.y})`);
    }

    draw(ctx: CanvasRenderingContext2D, lineWidth: number, color: string, bounds?: OrientedBounds): void {
        this.drawLine(ctx, lineWidth, color, bounds);

        let origin = this.origin;
        let endPoint = this.endPoint;
        let triangleBase = this.getPointAt(this.length * 0.9);
        
        if (bounds) {
            origin = bounds.toScreen(origin);
            endPoint = bounds.toScreen(endPoint);
            triangleBase = bounds.toScreen(triangleBase);
            lineWidth = lineWidth * Math.max(bounds.boundsToScreenScaleX, bounds.boundsToScreenScaleY);
        }

        let triangleLeft = triangleBase.rotateDegreesAbout(-45, endPoint);
        let triangleRight = triangleBase.rotateDegreesAbout(45, endPoint);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.ellipse(origin.x, origin.y, lineWidth, lineWidth, 0, 0, 2 * Math.PI);
        ctx.fill();

        // TODO: Fix alignment.
        ctx.beginPath();
        ctx.strokeStyle = color;
        //ctx.fillStyle = "white";
        //ctx.strokeStyle = "white";
        ctx.lineWidth = lineWidth;
        ctx.moveTo(endPoint.x, endPoint.y);
        ctx.lineTo(triangleLeft.x, triangleLeft.y);
        ctx.lineTo(triangleRight.x, triangleRight.y);
        ctx.fill();
        ctx.stroke();
    }

    static fromPoints(start: Vector2D, end: Vector2D) {
        let direction = start.directionTo(end);
        return new Ray2D(start, direction, direction.mag);
    }
}
