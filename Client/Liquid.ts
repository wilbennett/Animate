class Liquid extends Character {
    constructor(
        position: Vector,
        protected readonly _frictionCoeffecient: number,
        private readonly _width: number,
        private readonly _height: number) {
        super(position, new Vector(0, 0), new Vector(0, 0), 0, 0);
    }

    get bounds() {
        return new ReadonlyBounds(WorldOrientation.Up, this._position.x, this._position.y, this._width, this._height);
    }

    applyTo(character: Character) {
        if (!Math2D.isPointInBounds(this.bounds, character.position.x, character.position.y)) return;

        let c = this._frictionCoeffecient + character.frictionCoeffecient;
        this._forceVector = Physics.calcDrag(c, character.velocity);

        super.applyTo(character);
    }

    update(frame: number, timestamp: DOMHighResTimeStamp, delta: number, characters: Character[]) {
        //super.update(frame, timestamp, delta, characters);

        characters.forEach(character => this.applyTo(character), this);
    }

    draw(ctx: CanvasRenderingContext2D) {
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
