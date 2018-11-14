class Force {
    protected _force: Vector2D;
    protected _acceleration: Vector2D;

    constructor(protected _position: Vector2D, protected readonly _mass: number) {
        this._force = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
    }

    get position() { return this._position; }
    set position(value) { this._position = value; }

    get force() { return this._force; }
    get mass() { return this._mass; }
    get acceleration() { return this._acceleration; }

    calculateForce() {
    }

    protected calculateForceForCharacter(character: Character) {
    }

    applyForceTo(character: Character) {
        if (<Force>character === this) return;

        this.calculateForceForCharacter(character);
        character.applyForce(this._force);
    }
}
