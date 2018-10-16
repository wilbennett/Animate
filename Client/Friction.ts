class Friction extends Force {
    constructor() {
        super(Vector2D.empty, Vector2D.empty, -1);
    }

    applyTo(character: Character) {
        let normal = 1; // TODO: Calculate the proper normal;
        this._forceVector = Physics.calcFriction(character.frictionCoeffecient, normal, character.velocity);

        super.applyTo(character);
    }
}
