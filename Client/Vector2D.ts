class Vector2D {
    private _magSquared: number = -1;
    private _mag: number = -1;
    private _degrees: number = -1;
    private _radians: number = -1;
    private _polar: Polar | null = null;

    constructor(private _x: number, private _y: number) {
    }

    get x() { return this._x; }

    set x(value) {
        this._x = value;
        this.reset();
    }

    get y() { return this._y; }

    set y(value) {
        this._y = value;
        this.reset();
    }

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

    toString() { "(" + this._x.toFixed(3) + ", " + this._y.toFixed(3) + ")"; }

    static get empty() { return new Vector2D(0, 0); }

    clone(): Vector2D {
        let result = new Vector2D(this.x, this.y);
        result._mag = this._mag;
        result._degrees = this._degrees;
        result._radians = this._radians;
        result._polar = this._polar;
        return result;
    }

    reset() {
        this._mag = -1;
        this._degrees = -1;
        this._radians = -1;
        this._polar = null;
    }

    add(other: Vector2D): Vector2D {
        this._x += other.x;
        this._y += other.y;
        this.reset();
        return this;
    }

    subtract(other: Vector2D): Vector2D {
        this._x -= other.x;
        this._y -= other.y;
        this.reset();
        return this;
    }

    mult(scale: number): Vector2D {
        this._x *= scale;
        this._y *= scale;
        this.reset();
        return this;
    }

    div(scale: number): Vector2D {
        this._x /= scale;
        this._y /= scale;
        this.reset();
        return this;
    }

    dot(scale: number): Vector2D {
        this._x /= scale;
        this._y /= scale;
        this.reset();
        return this;
    }

    normalize(): Vector2D {
        let m = this.mag;

        if (m <= 0) return this;

        this.div(m);
        this.reset();
        return this;
    }

    static add(v1: Vector2D, v2: Vector2D): Vector2D { return v1.clone().add(v2); }
    static subtract(v1: Vector2D, v2: Vector2D): Vector2D { return v1.clone().subtract(v2); }
    static normalize(v: Vector2D): Vector2D { return v.clone().normalize(); }

    static mult(v: Vector2D, scale: number): Vector2D;
    static mult(scale: number, v: Vector2D): Vector2D;
    static mult(scale: any, v: any): Vector2D {
        let vec: Vector2D;
        let scalar: number;

        if (typeof v === "object") {
            vec = v;
            scalar = scale;
        } else {
            vec = scale;
            scalar = <number>v;
        }

        vec = vec.clone();
        vec.mult(scalar);
        return vec;
    }

    static div(v: Vector2D, scale: number): Vector2D;
    static div(scale: number, v: Vector2D): Vector2D;
    static div(scale: any, v: any): Vector2D {
        let vec: Vector2D;
        let scalar: number;

        if (typeof v === "object") {
            vec = v;
            scalar = scale;
        } else {
            vec = scale;
            scalar = <number>v;
        }

        vec = vec.clone();
        vec.div(scalar);
        return vec;
    }
}
