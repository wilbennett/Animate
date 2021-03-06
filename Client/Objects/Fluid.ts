﻿class Fluid extends Character2D {
    constructor(
        private readonly _density: number,
        dragCoefficient: number,
        position: Vector2D,
        width: number,
        height: number) {
        super(position, Vector2D.emptyVector, 0);

        this.dragCoefficient = dragCoefficient;
        this._width = width;
        this._height = height;
    }

    get density() { return this._density; }

    calculateForce() { }

    calculateForceForCharacter(character: Character2D): Vector2D {
        return Physics.calcDrag(this.density, 1, this.dragCoefficient, character.velocity);
    }

    update(frame: number, now: number, elapsedTime: number, timeScale: number, world: World2D) {
    }

    draw(viewport: Viewport2D, frame: number) {
        super.draw(viewport, frame);

        const ctx = viewport.ctx;

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
