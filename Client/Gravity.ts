class Gravity extends Force {
    private _gravityConst: number;

    constructor(private _orientation: WorldOrientation, gravityConst: number) {
        super(new Vector2D(0, 0), new Vector2D(0, 0), -1);

        // TODO: Temporary until proper adjustment.
        this._gravityConst = gravityConst * Physics.gravityScale;

        if (this._orientation === WorldOrientation.Up)
            this._gravityConst = -this._gravityConst;
    }

    get gravityConst() { return this._gravityConst; }

    applyTo(character: Character) {
        //this._forceVector = new Vector2D(0, 0);
        //this._forceVector = new Vector2D(0, this._gravityConst);
        // Gravity applies along the y axis.
        // All objects fall at the same rate because the effect of gravity is proportional to the mass of the object.
        this._forceVector = new Vector2D(0, this._gravityConst * character.mass);

        super.applyTo(character);
    }
}
