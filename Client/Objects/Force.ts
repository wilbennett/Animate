class Force {
    protected _force: Vector2D;
    protected _acceleration: Vector2D;
    protected _width: number;
    protected _height: number;
    protected _bounds: Bounds | null;
    private _world: World2D;

    constructor(private _position: Vector2D, protected readonly _mass: number) {
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
    get w() { return this._width; }
    get h() { return this._height; }
    get force() { return this._force; }
    get mass() { return this._mass; }
    get acceleration() { return this._acceleration; }
    get world() { return this._world; }

    get bounds() {
        if (!this._bounds) this._bounds = this.createBounds();

        return this._bounds;
    }

    protected createBounds() {
        return new Bounds(this.position.x, this.position.y, this.width, this.height);
    }

    protected createBoundsFromRadius(radius: number) {
        return this.world.orientation === WorldOrientation.Up
            ? new Bounds(this.position.x - radius, this.position.y - radius, this.w, this.h)
            : new Bounds(this.position.x - radius, this.position.y + radius, this.w, this.h);
    }

    addedToWorld(world: World2D) { this._world = world; }

    intersectsWithCharacter(character: Character2D) { return this.bounds.intersectsWith(character.bounds); }

    calculateForce() {
        this._force = Physics.calcNetForce(this._mass, this._acceleration);
    }

    calculateForceForCharacter(character: Character2D): Vector2D { return this._force; }

    applyForceTo(character: Character2D) {
        if (<Force>character === this) return;
        if (!this.intersectsWithCharacter(character)) return;

        this._force = this.calculateForceForCharacter(character);
        character.applyForce(this);
    }

    getName(obj: object) {
        let match = /function (\w+)/.exec(obj.constructor.toString());
        return match ? match[1] : "*UNKNOWN*";
    }
}
