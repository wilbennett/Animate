class Polar2D {
    private _degrees: number;
    private _vector: Vector2D;

    constructor(private readonly _radius: number, private _radians: number) {
    }

    get radius() { return this._radius; }

    get radians() { return this._radians; }

    get degrees() {
        if (!this._degrees)
            this._degrees = MathEx.toDegrees(this.radians);

        return this._degrees;
    }

    get vector() {
        if (!this._vector)
            this._vector = new Vector2D(this._radius * Math.cos(this._radians), this._radius * Math.sin(this._radians));

        return this._vector;
    }

    addRadians(radiansDelta: number): Polar2D {
        let newAngle = this._radians + radiansDelta;

        if (newAngle < 0 || newAngle > MathEx.TWO_PI)
            newAngle %= MathEx.TWO_PI;

        return new Polar2D(this.radius, newAngle);
    }
}
