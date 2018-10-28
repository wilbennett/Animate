class Bounds implements IBounds {
    protected readonly _isOrientedUp = this._orientation === WorldOrientation.Up;

    protected calcRight() { return this._x + this._width - 1; }

    protected calcTop = this._isOrientedUp
        ? function () { return this._y + this._height - 1; }
        : function () { return this._y; }

    protected calcBottom = this._isOrientedUp
        ? function () { return this._y; }
        : function () { return this._y + this._height - 1; }

    protected calcCenterX() { return Math.round(this._x + this._width / 2) }

    protected calcCenterY() { return Math.round(this._y + this._height / 2); }

    protected calcCenter() { return new Vector2D(this.calcCenterX(), this.calcCenterY()); }

    protected calcBoundsArray() { return [this._x, this._y, this._width, this._height]; }

    private readonly _right = this.calcRight();
    private readonly _top = this.calcTop();
    private readonly _bottom = this.calcBottom();
    private readonly _minY = this._bottom;
    private readonly _centerX = this.calcCenterX();
    private readonly _centerY = this.calcCenterY();
    private readonly _center = this.calcCenter();
    private readonly _boundsArray = this.calcBoundsArray();

    constructor(
        protected readonly _orientation: WorldOrientation,
        protected _x: number,
        protected _y: number,
        protected _width: number,
        protected _height: number) {
    }

    get orientation() { return this._orientation; }
    get x() { return this._x; }
    get left() { return this._x; }
    get y() { return this._y; }
    get top() { return this._top; }
    get width() { return this._width; }
    get height() { return this._height; }
    get right() { return this._right; }
    get bottom() { return this._bottom; }
    get centerX() { return this._centerX; }
    get centerY() { return this._centerY; }
    get center() { return this._center; }
    get minX() { return this._x; }
    get minY() { return this._minY; }
    get boundsArray() { return this._boundsArray; }

    toString() {
        return "((" + this.left.toFixed(0) + ", " + this.bottom.toFixed(0) + "), (" + this.right.toFixed(0) + ", " + this.top.toFixed(0) + "))";
    }

    leftOffset(x: number) { return this.left + x; }
    rightOffset(x: number) { return this.right - x; }

    topOffset = this._isOrientedUp
        ? function (y: number) { return this.top - 1 - y; }
        : function (y: number) { return this.top + y; }

    bottomOffset = this._isOrientedUp
        ? function (y: number) { return this.bottom + y; }
        : function (y: number) { return this.bottom - y; }

    offsetAbove = this._isOrientedUp
        ? function (y: number, delta: number) { return y + delta; }
        : function (y: number, delta: number) { return y - delta; }

    offsetBelow = this._isOrientedUp
        ? function (y: number, delta: number) { return y - delta; }
        : function (y: number, delta: number) { return y + delta; }

    leftPenetration(x: number) { return this.left - x; }
    rightPenetration(x: number) { return x - this.right; }

    topPenetration = this._isOrientedUp
        ? function (y: number) { return y - (this.top - 1); }
        : function (y: number) { return this.top - y; }

    bottomPenetration = this._isOrientedUp
        ? function (y: number) { return this.bottom - y; }
        : function (y: number) { return y - this.bottom; }

    isUp = this._isOrientedUp
        ? function (y: number) { return y > 0; }
        : function (y: number) { return y < 0; }

    isDown = this._isOrientedUp
        ? function (y: number) { return y < 0; }
        : function (y: number) { return y > 0; }

    toWorld = this._isOrientedUp
        ? function (x: number, y: number) { return [this.left + x, this.top - y]; }
        : function (x: number, y: number) { return [this.left + x, this.top + y]; }

    toScreen = this._isOrientedUp
        ? function (x: number, y: number) { return [x - this.left, this.top - y]; }
        : function (x: number, y: number) { return [x - this.left, y - this.top]; }

    inflate(dx: number, dy: number) {
        let x = this._x - dx;
        let y = this._y - dy;
        let width = this.width + dx + dx;
        let height = this.height + dy + dy;

        if (width < 0 && height < 0) {
            x = this._x;
            y = this._y;
            width = 0;
            height = 0;
        }
        else if (width < 0) {
            x = this._x;
            width  = 0;
            height = height;
        }
        else if (height < 0) {
            y = this._y;
            width  = width;
            height = 0;
        }

        return new Bounds(this._orientation, x, y, width, height);
    }
}
