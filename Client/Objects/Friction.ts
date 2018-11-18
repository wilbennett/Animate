class Friction extends Force {
    constructor(position: Vector2D, width: number, height: number) {
        super(position, 0);

        this._width = width;
        this._height = height;
}

    calculateForce() { }

    calculateForceForCharacter(character: Character2D): Vector2D {
        let normal = 1; // TODO: Calculate the proper normal;
        return Physics.calcFriction(character.frictionCoefficient, normal, character.velocity);
    }
}
