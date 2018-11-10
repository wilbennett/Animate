class Viewport2D extends ScreenBounds {
    constructor(
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

    draw(ctx: CanvasRenderingContext2D, width: number, color: string, bounds?: OrientedBounds) {
        super.draw(ctx, width, color, this.isTransformed ? undefined : this);
    }
}
