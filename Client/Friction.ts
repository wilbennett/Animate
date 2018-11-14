﻿class Friction extends Force {
    constructor() {
        super(Vector2D.emptyVector, Vector2D.emptyVector, -1);
    }

    applyForceTo(character: Character) {
        let normal = 1; // TODO: Calculate the proper normal;
        this._forceVector = Physics.calcFriction(character.frictionCoeffecient, normal, character.velocity);

        super.applyForceTo(character);
    }
}
