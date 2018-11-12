class Bounds {
    private readonly _maxX: number;
    private readonly _maxY: number;
    private _center: Vector2D;
    private readonly _origin: Vector2D;
    protected _topLeft: Vector2D;
    protected _bottomLeft: Vector2D;
    protected _bottomRight: Vector2D;
    protected _topRight: Vector2D;
    private _boundsArray: number[];

    constructor(
        x: number,
        y: number,
        private readonly _width: number,
        private readonly _height: number) {
        this._origin = new Vector2D(x, y);
        this._maxX = this.x + this.width - 1;
        this._maxY = this.y + this.height - 1;
    }

    get maxX() { return this._maxX; }
    get maxY() { return this._maxY; }
    get x() { return this.origin.x; }
    get y() { return this.origin.y; }
    get width() { return this._width; }
    get height() { return this._height; }
    get left() { return this.x; }
    get right() { return this.maxX; }

    get origin() { return this._origin; }

    get topLeft() {
        if (!this._topLeft) this._topLeft = this.origin;

        return this._topLeft;
    }

    get bottomRight() {
        if (!this._bottomRight) this._bottomRight = new Vector2D(this.right, this.maxY);

        return this._bottomRight;
    }

    get bottomLeft() {
        if (!this._bottomLeft) this._bottomLeft = new Vector2D(this.topLeft.x, this.bottomRight.y);

        return this._bottomLeft;
    }

    get topRight() {
        if (!this._topRight) this._topRight = new Vector2D(this.right, this.topLeft.y);

        return this._topRight;
    }

    get top() { return this.topLeft.y; }
    get bottom() { return this.bottomLeft.y; }

    get center() {
        if (!this._center) this._center = new Vector2D(this.x + this.width / 2, this.y + this.height / 2);

        return this._center;
    }

    get centerX() { return this.center.x; }
    get centerY() { return this.center.y; }

    get boundsArray() {
        if (!this._boundsArray) this._boundsArray = [this.x, this.y, this.width, this.height];

        return this._boundsArray;
    }

    toString() {
        return "((" + this.left.toFixed(0) + ", " + this.bottom.toFixed(0) + "), (" + this.right.toFixed(0) + ", " + this.top.toFixed(0) + "))";
    }

    inflate(dx: number, dy: number) {
        let x = this.x - dx;
        let y = this.y - dy;
        let width = this.width + dx + dx;
        let height = this.height + dy + dy;

        if (width < 0 && height < 0) {
            x = this.x;
            y = this.y;
            width = 0;
            height = 0;
        }
        else if (width < 0) {
            x = this.x;
            width  = 0;
            height = height;
        }
        else if (height < 0) {
            y = this.y;
            width  = width;
            height = 0;
        }

        return new Bounds(x, y, width, height);
    }

    draw(ctx: CanvasRenderingContext2D, width: number, color: string) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        //ctx.moveTo(this.x, this.top);
        //ctx.lineTo(this.x, this.bottom);
        //ctx.lineTo(this.right, this.bottom);
        //ctx.lineTo(this.right, this.top);
        //ctx.lineTo(this.x, this.top);
        //ctx.stroke();
        ctx.strokeRect(this.x, this.top, this.width, this.height);
    }

    leftOffset(x: number) { return this.left + x; }
    rightOffset(x: number) { return this.right - x; }
    topOffsetAbove(delta: number) { return this.top - delta; }
    topOffsetBelow(delta: number) { return this.top + delta; }
    bottomOffsetAbove(delta: number) { return this.bottom - delta; }
    bottomOffsetBelow(delta: number) { return this.bottom + delta; }
    offsetAbove(y: number, delta: number) { return y - delta; }
    offsetBelow(y: number, delta: number) { return y + delta; }

    leftPenetration(x: number) { return this.left - x; }
    rightPenetration(x: number) { return x - this.right; }
    topPenetration(y: number) { return this.top - y; }
    bottomPenetration(y: number) { return y - this.bottom; }
    isUp(y: number) { return y < 0; }
    isDown(y: number) { return y > 0; }

    contains(point: Point2D) {
        return point.x >= this.x && point.x <= this.maxX && point.y >= this.y && point.y <= this.maxY;
    }
}
