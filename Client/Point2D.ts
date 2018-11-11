class Point2D {
    private static _emptyPoint: Point2D;

    constructor(private readonly _x: number, private readonly _y: number) {
    }

    get x() { return this._x; }
    get y() { return this._y; }

    static get emptyPoint() {
        if (!this._emptyPoint)
            this._emptyPoint = new Point2D(0, 0);

        return this._emptyPoint;
    }

    draw(ctx: CanvasRenderingContext2D, size: number, color: string) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, MathEx.TWO_PI, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}
