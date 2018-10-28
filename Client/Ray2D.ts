class Ray2D {
    private readonly _direction: Vector2D;
    private readonly _endPoint: Vector2D;

    constructor(private _origin: Vector2D, direction: Vector2D, private _length: number) {
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
        result.add(this.origin);
        return result;
    }

    protected drawLine(ctx: CanvasRenderingContext2D, width: number, color: string): void {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(this.origin.x, this.origin.y);
        ctx.lineTo(this._endPoint.x, this._endPoint.y);
        ctx.stroke();
        //console.log(`length: ${length}  - (${this.origin.x}, ${this.origin.y}) -> (${this._endPoint.x}, ${this._endPoint.y})`);
    }

    draw(ctx: CanvasRenderingContext2D, width: number, color: string): void {
        this.drawLine(ctx, width, color);

        ctx.fillStyle = color;
        ctx.ellipse(this.origin.x, this.origin.y, width, width, 0, 0, 2 * Math.PI);
        ctx.fill();
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
}
