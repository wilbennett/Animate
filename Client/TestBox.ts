class TestBox {
    private readonly _origX: number;
    private readonly _origY: number;
    public readonly radiusX: number;
    public readonly radiusY: number;

    constructor(public x: number, public y: number, public w: number, public h: number, public margin: number) {
        this._origX = x;
        this._origY = y;
        this.radiusX = w / 2;
        this.radiusY = h / 2;
    }

    get radius() { return this.radiusX; }
    get right() { return this.x + this.w - 1; }
    get bottom() { return this.y + this.h - 1; }
    get center() { return new Vector2D(this.x + this.radius, this.y + this.radius); }

    reset() {
        this.x = this._origX;
        this.y = this._origY;
    }

    moveRight() { this.x = this.x + this.w + this.margin; }
    moveDown() { this.y = this.y + this.h + this.margin; }
    moveUp() { this.y = this.y - this.h - this.margin; }

    moveUpRight() {
        this.moveUp();
        this.moveRight();
    }

    offsetTopLeft(dx: number, dy: number) { return new Vector2D(this.x + dx, this.y + dy); }
    offsetBottomRight(dx: number, dy: number) { return new Vector2D(this.right + dx, this.bottom + dy); }
}
