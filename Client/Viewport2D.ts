class Viewport2D extends ReadonlyBounds {
    constructor(
        protected readonly _ctx: CanvasRenderingContext2D,
        orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number) {
        super(orientation, x, y, width, height);
    }

    applyTransform = this._isOrientedUp
        ?
        function () {
            const ctx = this._ctx;
            ctx.save();
            ctx.translate(-this.left, this.top);
            ctx.scale(1, -1);

            ctx.beginPath();
            ctx.rect(this._x, this._y, this._width, this._height);
            ctx.clip();
            ctx.closePath();
        }
        :
        function () {
            this._ctx.save();
            this._ctx.translate(-this.left, -this.top);
        };

    restoreTransform() {
        this._ctx.restore();
    }
}
