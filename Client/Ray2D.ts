class Ray2D {
    private readonly _origin: Vector2D;
    private readonly _direction: Vector2D;
    private readonly _length: number;
    private readonly _endPoint: Vector2D;
    private A: number;
    private B: number;
    private C: number;

    constructor(start: Vector2D, end: Vector2D);
    constructor(origin: Vector2D, direction: Vector2D, length: number);
    constructor(origin: Vector2D, direction: Vector2D, length?: number) {
        this._origin = origin;

        if (length) {
            this._direction = direction.normalize();
            this._length = length;
            this._endPoint = this.getPointAt(this._length);
        }
        else {
            let end = direction;
            let dir = this._origin.directionTo(end);
            this._direction = dir.normalize();
            this._length = dir.mag;
            this._endPoint = end;
        }
    }

    get origin() { return this._origin; }
    get direction() { return this._direction; }
    get length() { return this._length; }
    get endPoint() { return this._endPoint; }
    get normal() { return this.direction.normal; }

    getPointAt(length: number): Vector2D {
        //console.log(`Origin (${this.origin.x}, ${this.origin.y}) - Direction (${this.direction.x}, ${this.direction.y})`);
        let result = this.direction.mult(length);
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

    //*
    getInstersection(target: Ray2D): Vector2D | null {
        let thisOrigin = this.origin;
        let targetOrigin = target.origin;
        let thisDirection = this.direction;
        let targetDirection = target.direction;

        let det = thisDirection.y * targetDirection.x - thisDirection.x * targetDirection.y;

        if (det === 0) return null;

        let dx = thisOrigin.x - targetOrigin.x;
        let dy = targetOrigin.y - thisOrigin.y;

        let t1 = (targetDirection.x * dy + targetDirection.y * dx) / det;

        if (t1 < 0 || t1 > this.length) return null;

        //let t2 = (thisDirection.x * dy + thisDirection.y * dx) / det;

        //if (t2 < 0 || t2 > target.length) return null;

        return this.getPointAt(t1);
    }
    /*/
    getInstersection(target: Ray2D): Vector2D | null {
        let a1 = this.endPoint.y - this.origin.y;
        let b1 = this.origin.x - this.endPoint.x;
        let c1 = a1 * this.origin.x + b1 * this.origin.y;
        let a2 = target.endPoint.y - target.origin.y;
        let b2 = target.origin.x - target.endPoint.x;
        let c2 = a2 * target.origin.x + b2 * target.origin.y;

        let det = a1 * b2 - a2 * b1;

        if (det === 0) return null;

        let x = (b2 * c1 - b1 * c2) / det;
        let y = (a1 * c2 - a2 * c1) / det;

        if (x < Math.min(this.origin.x, this.endPoint.x) || x > Math.max(this.origin.x, this.endPoint.x)) return null;
        if (y < Math.min(this.origin.y, this.endPoint.y) || y > Math.max(this.origin.y, this.endPoint.y)) return null;

        //if (x < Math.min(target.origin.x, target.endPoint.x) || x > Math.max(target.origin.x, target.endPoint.x)) return null;
        //if (y < Math.min(target.origin.y, target.endPoint.y) || y > Math.max(target.origin.y, target.endPoint.y)) return null;

        return new Vector2D(x, y);
    }
    //*/

    pointSide(point: Vector2D) {
        if (!this.A) { // Standard form.
            const origin = this.origin;
            const end = this.endPoint;
            this.A = end.y - origin.y;
            this.B = origin.x - end.x;
            this.C = this.A * origin.x + this.B * origin.y;
        }

        return MathEx.sign(this.A * point.x + this.B * point.y - this.C);
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
}
