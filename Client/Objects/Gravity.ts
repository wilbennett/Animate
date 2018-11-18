class Gravity extends Force {
    constructor(
        orientation: WorldOrientation,
        private readonly _gravityConst: number,
        position: Vector2D,
        width: number,
        height: number) {
        super(Vector2D.emptyVector, 0);

        this._gravityConst = this._gravityConst * Physics.gravityScale;

        if (orientation === WorldOrientation.Up)
            this._gravityConst = -this._gravityConst;

        this._position = position;
        this._width = width;
        this._height = height;
    }

    get gravityConst() { return this._gravityConst; }

    calculateForce() { }

    calculateForceForCharacter(character: Character2D): Vector2D {
        return new Vector2D(0, this._gravityConst * character.mass);
    }
}
