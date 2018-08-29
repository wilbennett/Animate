class Bounds extends ReadonlyBounds {
    constructor(
        orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number) {
        super(orientation, x, y, width, height);
    }

    get x() { return this._x; }
    set x(value: number) { this._x = value; }
    get left() { return this._x; }
    set left(value: number) { this.x = value; }
    get y() { return this._y; }
    set y(value: number) { this._y = value; }
    get top() { return this.calcTop(); }
    get width() { return this._width; }
    set width(value: number) { this._width = value; }
    get height() { return this._height; }
    set height(value: number) { this._height = value; }
    get right() { return this.calcRight(); }
    get bottom() { return this.calcBottom(); }
    get centerX() { return this.calcCenterX(); }
    get centerY() { return this.calcCenterY(); }
    get minY() { return this.calcBottom(); }
    get boundsArray() { return this.calcBoundsArray(); }

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
            width = 0;
            height = height;
        }
        else if (height < 0) {
            y = this._y;
            width = width;
            height = 0;
        }

        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        return this;
    }
}
