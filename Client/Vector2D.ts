class Vector2D {
    private _magSquared: number = -1;
    private _mag: number = -1;
    private _degrees: number = -1;
    private _radians: number = -1;
    private _polar: Polar | null = null;
    private _normal: Vector2D | null = null;

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

    get normal() {
        if (!this._normal) {
            this._normal = new Vector2D(this.y, -this.x);
        }

        return this._normal;
    }

    toString() { "(" + this._x.toFixed(3) + ", " + this._y.toFixed(3) + ")"; }

    static get empty() { return new Vector2D(0, 0); }

    clone(): Vector2D {
        let result = new Vector2D(this.x, this.y);
        result._magSquared = this._magSquared;
        result._mag = this._mag;
        result._degrees = this._degrees;
        result._radians = this._radians;
        result._polar = this._polar;
        result._normal = this._normal;
        return result;
    }

    toPoint(): Point2D { return new Point2D(this.x, this.y); }

    reset() {
        this._magSquared = -1;
        this._mag = -1;
        this._degrees = -1;
        this._radians = -1;
        this._polar = null;
        this._normal = null;
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

    dot(other: Vector2D): number {
        return Math2D.dot(this.x, this.y, other.x, other.y);
    }

    normalize(): Vector2D {
        let m = this.mag;

        if (m <= 0) return this;

        this.div(m);
        this.reset();
        return this;
    }

    reflectViaNormal(normal: Vector2D): Vector2D {
        // -(2 * (v . normal) * normal - v)
        let dot2 = 2 * this.dot(normal);
        let dot2TimesNormal = Vector2D.mult(dot2, normal);
        return dot2TimesNormal.subtract(this).mult(-1);

        // v - 2 * (v . normal) * normal
        //return this.subtract(dot2TimesNormal);
    }

    reflectOff(reflector: Vector2D): Vector2D {
        return this.reflectViaNormal(reflector.normal);
    }

    reflect(source: Vector2D): Vector2D {
        return source.reflectViaNormal(this.normal);
    }

    draw(ctx: CanvasRenderingContext2D, size: number, color: string) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, MathEx.TWO_PI, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    static add(v1: Vector2D, v2: Vector2D): Vector2D { return v1.clone().add(v2); }
    static subtract(v1: Vector2D, v2: Vector2D): Vector2D { return v1.clone().subtract(v2); }
    static normalize(v: Vector2D): Vector2D { return v.clone().normalize(); }
    static dot(v1: Vector2D, v2: Vector2D): number { return v1.dot(v2); }

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
