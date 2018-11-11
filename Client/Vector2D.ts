class Vector2D extends Point2D {
    private _magSquared: number = -1;
    private _mag: number = -1;
    private _degrees: number = -1;
    private _radians: number = -1;
    private _polar: Polar2D | null = null;
    private _normal: Vector2D | null = null;
    private static _emptyVector: Vector2D;

    constructor(x: number, y: number) {
        super(x, y);
    }

    get magSquared() {
        if (this._magSquared < 0)
            this._magSquared = Math2D.dot(this.x, this.y, this.x, this.y);

        return this._magSquared;
    }

    get mag() {
        if (this._mag < 0)
            this._mag = Math.sqrt(this.magSquared);

        return this._mag;
    }

    get radians() {
        if (this._radians < 0)
            this._radians = Math2D.radians(this.x, this.y);

        return this._radians;
    }

    get degrees() {
        if (this._degrees < 0)
            this._degrees = MathEx.toDegrees(this.radians);

        return this._degrees;
    }

    get polar() {
        if (!this._polar)
            this._polar = new Polar2D(this.mag, this.radians);

        return this._polar;
    }

    get normal() {
        if (!this._normal) {
            this._normal = new Vector2D(this.y, -this.x);
        }

        return this._normal;
    }

    toString() { "(" + this.x.toFixed(3) + ", " + this.y.toFixed(3) + ")"; }

    static get emptyVector() {
        if (!this._emptyVector)
            this._emptyVector = new Vector2D(0, 0);

        return this._emptyVector;
    }

    add(other: Vector2D): Vector2D { return new Vector2D(this.x + other.x, this.y + other.y); }
    subtract(other: Vector2D): Vector2D { return new Vector2D(this.x - other.x, this.y - other.y); }
    mult(scale: number): Vector2D { return new Vector2D(this.x * scale, this.y * scale); }
    div(scale: number): Vector2D { return new Vector2D(this.x / scale, this.y / scale); }
    dot(other: Vector2D): number { return Math2D.dot(this.x, this.y, other.x, other.y); }

    normalize(): Vector2D {
        let m = this.mag;

        if (m <= 0) return this;

        return this.div(m);
    }

    directionTo(target: Vector2D): Vector2D { return target.subtract(this); }

    rotateRadiansAboutCore(x: number, y: number, angle: number, centerX: number, centerY: number): Vector2D {
        let transX = x - centerX;
        let transY = y - centerY;
        let newX = transX * Math.cos(angle) - transY * Math.sin(angle);
        let newY = transX * Math.sin(angle) + transY * Math.cos(angle);
        return new Vector2D(newX + centerX, newY + centerY);
    }

    rotateRadians(angle: number): Vector2D {
        return this.rotateRadiansAboutCore(this.x, this.y, angle, 0, 0);
    }

    rotateDegrees(angle: number): Vector2D {
        return this.rotateRadians(MathEx.toRadians(angle));
    }

    rotateRadiansAbout(angle: number, center: Vector2D): Vector2D {
        return this.rotateRadiansAboutCore(this.x, this.y, angle, center.x, center.y);
    }

    rotateDegreesAbout(angle: number, center: Vector2D): Vector2D {
        return this.rotateRadiansAbout(MathEx.toRadians(angle), center);
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

    withX(x: number) { return new Vector2D(x, this.y); }
    withY(y: number) { return new Vector2D(this.x, y); }

    static fromRadians(angle: number) { return new Vector2D(Math.cos(angle), Math.sin(angle)); }
    static fromDegrees(angle: number) { return this.fromRadians(MathEx.toRadians(angle)); }

    static add(v1: Vector2D, v2: Vector2D): Vector2D { return v1.add(v2); }
    static subtract(v1: Vector2D, v2: Vector2D): Vector2D { return v1.subtract(v2); }
    static normalize(v: Vector2D): Vector2D { return v.normalize(); }
    static dot(v1: Vector2D, v2: Vector2D): number { return v1.dot(v2); }

    static mult(v: Vector2D, scale: number): Vector2D;
    static mult(scale: number, v: Vector2D): Vector2D;
    static mult(scale: any, v: any): Vector2D {
        let vec: Vector2D;
        let scalar: number;

        if (v instanceof Vector2D) {
            vec = v;
            scalar = scale;
        } else {
            vec = scale;
            scalar = <number>v;
        }

        return vec.mult(scalar);
    }

    static div(v: Vector2D, scale: number): Vector2D;
    static div(scale: number, v: Vector2D): Vector2D;
    static div(scale: any, v: any): Vector2D {
        let vec: Vector2D;
        let scalar: number;

        if (v instanceof Vector2D) {
            vec = v;
            scalar = scale;
        } else {
            vec = scale;
            scalar = <number>v;
        }

        return vec.div(scalar);
    }
}
