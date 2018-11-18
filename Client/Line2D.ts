class Line2D extends Ray2D {

    constructor(ray: Ray2D);
    constructor(start: Vector2D, end: Vector2D);
    constructor(origin: Vector2D, direction: Vector2D, length: number);
    constructor(origin: any, direction?: Vector2D, length?: number) {
        if (origin instanceof Ray2D) {
            let ray = origin;
            super(ray.origin, ray.direction, ray.length);
        } else if (length && direction) {
            super(origin, direction, length);
        }
        else if (direction) {
            let end = direction;
            super(origin, end);
        }
    }

    rotateRadians(angle: number): Line2D {
        return new Line2D(this.origin, this.endPoint.rotateRadiansAbout(angle, this.origin));
    }

    rotateDegrees(angle: number): Line2D {
        return this.rotateRadians(MathEx.toRadians(angle));
    }

    rotateRadiansAbout(angle: number, center: Vector2D): Line2D {
        return new Line2D(
            this.origin.rotateRadiansAbout(angle, center),
            this.endPoint.rotateRadiansAbout(angle, center));
    }

    rotateDegreesAbout(angle: number, center: Vector2D): Line2D {
        return this.rotateRadiansAbout(MathEx.toRadians(angle), center);
    }

    reflectViaNormal(normal: Vector2D): Line2D {
        let ray = super.reflectViaNormal(normal);
        return new Line2D(this.endPoint, ray.endPoint);
    }

    reflectOff(reflector: Line2D): Line2D {
        return this.reflectViaNormal(reflector.normal);
    }

    reflect(source: Line2D): Line2D {
        return source.reflectViaNormal(this.normal);
    }

    toRay(): Ray2D { return new Ray2D(this.origin, this.direction, this.length); }

    draw(ctx: CanvasRenderingContext2D, width: number, color: string, bounds?: OrientedBounds): void {
        super.drawLine(ctx, width, color, bounds);
    }
}
