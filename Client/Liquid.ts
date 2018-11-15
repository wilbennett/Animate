﻿class Liquid extends Character {
    constructor(
        position: Vector2D,
        protected readonly _frictionCoeffecient: number,
        private readonly _width: number,
        private readonly _height: number) {
        super(position, Vector2D.emptyVector, 0);
    }

    get bounds() {
        return new Bounds(this._position.x, this._position.y, this._width, this._height);
    }

    calculateForce() { }

    calculateForceForCharacter(character: Character): Vector2D {
        if (!Math2D.isPointInBounds(this.bounds, character.position.x, character.position.y))
            return Vector2D.emptyVector;

        let c = this._frictionCoeffecient + character.frictionCoeffecient;
        return Physics.calcDrag(c, character.velocity);
    }

    update(frame: number, timestamp: DOMHighResTimeStamp, delta: number, characters: Character[]) {
    }

    draw(ctx: CanvasRenderingContext2D, frame: number) {
        let origAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "gray";
        let rect = this.bounds;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = origAlpha;
    }
}
