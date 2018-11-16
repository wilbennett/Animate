class ScreenBounds extends OrientedBounds {
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
        super(orientation, x, y, width, height);

        if (!screenWidth) screenWidth = width;
        if (!screenHeight) screenHeight = height;

        this._screenTopLeft = new Vector2D(screenX, screenY);
        this._screenWidth = screenWidth;
        this._screenHeight = screenHeight;

        this.calcScreenOffsets();
    }

    protected applyClipRegionToContext(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();
        ctx.closePath();
    }

    applyTransformToContext(ctx: CanvasRenderingContext2D) {
        if (this.isTransformed) return;

        ctx.save();

        if (this._isOrientedUp) {
            ctx.transform(
                this._boundsToScreenScaleX,
                0,
                0,
                -this._boundsToScreenScaleY,
                this.screenLeft - this.x * this._boundsToScreenScaleX,
                this.screenTop + (this.y * this._boundsToScreenScaleY + this.screenHeight - 1));
        }
        else {
            ctx.transform(
                this._boundsToScreenScaleX,
                0,
                0,
                this._boundsToScreenScaleY,
                this.screenLeft - this.x * this._boundsToScreenScaleX,
                this.screenTop - this.y * this._boundsToScreenScaleY);
        }

        this.applyClipRegionToContext(ctx);
        this._isTransformed = true;
    }
}
