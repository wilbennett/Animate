class Line2D extends Ray2D {

    constructor(start: Vector2D, end: Vector2D) {
        let direction = Vector2D.subtract(end, start);
        super(start, direction, direction.mag);
    }


    draw(ctx: CanvasRenderingContext2D, width: number, color: string): void {
        super.drawLine(ctx, width, color);
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
}
