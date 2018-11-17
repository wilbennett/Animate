class Force {
    protected _force: Vector2D;
    protected _acceleration: Vector2D;
    protected _width: number;
    protected _height: number;
    protected _bounds: Bounds | null;

    constructor(protected _position: Vector2D, protected readonly _mass: number) {
        this._force = Vector2D.emptyVector;
        this._acceleration = Vector2D.emptyVector;
    }

    get position() { return this._position; }

    set position(value) {
        this._position = value;
        this._bounds = null;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get force() { return this._force; }
    get mass() { return this._mass; }
    get acceleration() { return this._acceleration; }

    get bounds() {
        if (!this._bounds)
            this._bounds = new Bounds(this.position.x, this.position.y, this.width, this.height);

        return this._bounds;
    }

    intersectsWithCharacter(character: Character2D) { return true; }

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
