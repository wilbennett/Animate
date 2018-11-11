﻿class Polar {
    private _degrees: number = -1;
    private _vector: Vector2D | null = null;

    constructor(private readonly _radius: number, private _radians: number) {
    }

    get radius() { return this._radius; }

    get radians() { return this._radians; }

    get degrees() {
        if (this._degrees < 0)
            this._degrees = MathEx.toDegrees(this.radians);

        return this._degrees;
    }

    get vector() {
        if (!this._vector)
            this._vector = new Vector2D(this._radius * Math.cos(this._radians), this._radius * Math.sin(this._radians));

        return this._vector;
    }

    addRadians(radiansDelta: number): Polar {
        let newAngle = this._radians + radiansDelta;

        if (newAngle < 0 || newAngle > MathEx.TWO_PI)
            newAngle %= MathEx.TWO_PI;

        return new Polar(this.radius, newAngle);
    }
}
