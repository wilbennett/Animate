class Viewport2D extends ScreenBounds {
    constructor(
        private _ctx: CanvasRenderingContext2D,
        orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number,
        screenX: number,
        screenY: number,
        screenWidth?: number,
        screenHeight?: number) {
        super(orientation, x, y, width, height, screenX, screenY, screenWidth, screenHeight);
    }

    get ctx() { return this._ctx; }

    draw(ctx: CanvasRenderingContext2D, width: number, color: string, bounds?: OrientedBounds) {
        super.draw(this.ctx, width, color, this.isTransformed ? undefined : this);
    }

    applyTransform() { super.applyTransformToContext(this.ctx); }
    restoreTransform() { super.restoreTransformToContext(this.ctx); }
}
