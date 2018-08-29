class Vector {
    private _magSquared: number = -1;
    private _mag: number = -1;
    private _degrees: number = -1;
    private _radians: number = -1;
    private _polar: Polar | null = null;

    constructor(private _x: number, private _y: number) {
    }

    get x() { return this._x; }
    set x(value) { this._x = value; }

    get y() { return this._y; }
    set y(value) { this._y = value; }

    get magSquared() {
        if (this._magSquared < 0)
            this._magSquared = Math2D.dot(this._x, this._y, this._x, this._y);

        return this._magSquared;
    }

    get mag() {
        if (this._mag < 0)
            this._mag = Math.sqrt(this.magSquared);

        return this._mag;
    }

    get radians() {
        if (this._radians < 0)
            this._radians = Math2D.radians(this._x, this._y);

        return this._radians;
    }

    get degrees() {
        if (this._degrees < 0)
            this._degrees = MathEx.toDegrees(this.radians);

        return this._degrees;
    }

    get polar() {
        if (!this._polar)
            this._polar = new Polar(this.mag, this.radians);

        return this._polar;
    }

    toString = () => "(" + this._x.toFixed(3) + ", " + this._y.toFixed(3) + ")";

    static get empty() { return new Vector(0, 0); }

    reset() {
        this._mag = -1;
        this._degrees = -1;
        this._radians = -1;
        this._polar = null;
    }

    add(other: Vector) {
        this._x += other.x;
        this._y += other.y;
        this.reset();
    }

    subtract(other: Vector) {
        this._x -= other.x;
        this._y -= other.y;
        this.reset();
    }

    mult(scale: number) {
        this._x *= scale;
        this._y *= scale;
        this.reset();
    }

    div(scale: number) {
        this._x /= scale;
        this._y /= scale;
        this.reset();
    }

    dot(scale: number) {
        this._x /= scale;
        this._y /= scale;
        this.reset();
    }

    normalize() {
        let m = this.mag;

        if (m <= 0) return;

        this.div(m);
        this.reset();
    }

    static add = (v1: Vector, v2: Vector) => new Vector(v1.x + v2.x, v1.y + v2.y);
    static subtract = (v1: Vector, v2: Vector) => new Vector(v1.x - v2.x, v1.y - v2.y);
    static mult = (v: Vector, scale: number) => new Vector(v.x * scale, v.y * scale);
    static div = (v: Vector, scale: number) => new Vector(v.x / scale, v.y / scale);
    static normalize = (v: Vector) => v.mag > 0 ? Vector.div(v, v.mag) : v;
}
