﻿class Force {
    protected twoPI: number = 2 * Math.PI;

    constructor(
        protected _position: Vector2D,
        protected _forceVector: Vector2D,
        protected _forceRadius: number) {
    }

    get forceVector() { return this._forceVector; }

    applyTo(character: Character) {
        character.applyForce(this._forceVector);
    }
}
