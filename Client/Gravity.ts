class Gravity extends Force {
    constructor(private readonly _orientation: WorldOrientation, private readonly _gravityConst: number) {
        super(Vector2D.emptyVector, 0);

        if (this._orientation === WorldOrientation.Up)
            this._gravityConst = -this._gravityConst;
    }

    get gravityConst() { return this._gravityConst; }

    calculateForce() { }

    calculateForceForCharacter(character: Character2D): Vector2D {
        return new Vector2D(0, this._gravityConst * character.mass);
    }
}
