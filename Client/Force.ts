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
        this._force = Physics.calcNetForce(this._mass, this._acceleration);
    }

    calculateForceForCharacter(character: Character2D): Vector2D { return this._force; }

    applyForceTo(character: Character2D) {
        if (<Force>character === this) return;

        this._force = this.calculateForceForCharacter(character);
        character.applyForce(this);
    }

    getName(obj: object) {
        let match = /function (\w+)/.exec(obj.constructor.toString());
        return match ? match[1] : "*UNKNOWN*";
    }
}
