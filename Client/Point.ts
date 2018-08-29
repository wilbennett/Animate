class Point {
    constructor(private _x: number, private _y: number) {
    }

    get x() { return this._x; }
    get y() { return this._y; }

    draw(ctx: CanvasRenderingContext2D, size: number, color: string) {
        ctx.beginPath();
        ctx.arc(this._x, this._y, size, 0, MathEx.TWO_PI, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}
