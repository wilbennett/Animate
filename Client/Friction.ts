class Friction extends Force {
    constructor() {
        super(Vector2D.emptyVector, -1);
    }

    calculateForce() { }

    calculateForceForCharacter(character: Character2D): Vector2D {
        let normal = 1; // TODO: Calculate the proper normal;
        return Physics.calcFriction(character.frictionCoeffecient, normal, character.velocity);
    }
}
