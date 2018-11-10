class OrientedBounds extends Bounds {
    protected readonly _isOrientedUp = this._orientation === WorldOrientation.Up;

    protected _screenTopLeft: Vector2D;
    protected _screenBottomRight: Vector2D;
    protected _screenWidth: number;
    protected _screenHeight: number;
    protected _screenOffset: Vector2D;
    protected _boundsToScreenScaleX: number;
    protected _boundsToScreenScaleY: number;
    protected _screenToBoundsScaleX: number;
    protected _screenToBoundsScaleY: number;
    protected _boundsToScreenOffsetY: number;
    protected _screenToBoundsOffsetY: number;
    protected _isTransformed: boolean = false;

    constructor(
        protected readonly _orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number) {
        super(x, y, width, height);

        this._screenTopLeft = new Vector2D(this.x, this.y);
        this._screenWidth = this.width;
        this._screenHeight = this.height;

        this.calcScreenOffsets();
    }

    get orientation() { return this._orientation; }

    get topLeft() {
        if (!this._topLeft) {
            this._topLeft = this._isOrientedUp
                ? new Vector2D(this.left, this.maxY)
                : this.origin;
        }

        return this._topLeft;
    }

    get bottomRight() {
        if (!this._bottomRight) {
            this._bottomRight = this._isOrientedUp
                ? new Vector2D(this.right, this.y)
                : new Vector2D(this.right, this.maxY);
        }

        return this._bottomRight;
    }

    get screenLeft() { return this._screenTopLeft.x; }
    get screenTop() { return this._screenTopLeft.y; }
    get screenRight() { return this._screenBottomRight.x; }
    get screenBottom() { return this._screenBottomRight.y; }
    get screenWidth() { return this._screenWidth; }
    get screenHeight() { return this._screenHeight; }

    get boundsToScreenScaleX(): number { return this._boundsToScreenScaleX; }
    get boundsToScreenScaleY(): number { return this._boundsToScreenScaleY; }
    get screenToBoundsScaleX(): number { return this._screenToBoundsScaleX; }
    get screenToBoundsScaleY(): number { return this._screenToBoundsScaleY; }

    get isTransformed(): boolean { return this._isTransformed; }

    topOffsetAbove(delta: number) {
        return this._isOrientedUp ? this.top + delta : super.topOffsetAbove(delta);
    }

    topOffsetBelow(delta: number) {
        return this._isOrientedUp ? this.top - delta : super.topOffsetBelow(delta);
    }

    bottomOffsetAbove(delta: number) {
        return this._isOrientedUp ? this.bottom + delta : super.bottomOffsetAbove(delta);
    }

    bottomOffsetBelow(delta: number) {
        return this._isOrientedUp ? this.bottom - delta : super.bottomOffsetBelow(delta);
    }

    offsetAbove(y: number, delta: number) { return this._isOrientedUp ? y + delta : y - delta; }
    offsetBelow(y: number, delta: number) { return this._isOrientedUp ? y - delta : y + delta; }

    topPenetration(y: number) { return this._isOrientedUp ? y - this.top : this.top - y; }
    bottomPenetration(y: number) { return this._isOrientedUp ? this.bottom - y : y - this.bottom; }

    isUp(y: number) { return this._isOrientedUp ? y > 0 : y < 0; }
    isDown(y: number) { return this._isOrientedUp ? y < 0 : y > 0; }

    draw(ctx: CanvasRenderingContext2D, width: number, color: string, bounds?: OrientedBounds) {
        let topLeft = this._screenTopLeft;
        let bottomRight = this._screenBottomRight;
        topLeft = this.topLeft;
        bottomRight = this.bottomRight;

        if (bounds) {
            topLeft = bounds.toScreen(this.topLeft);
            bottomRight = bounds.toScreen(this.bottomRight);
            width = width * Math.max(bounds.boundsToScreenScaleX, bounds.boundsToScreenScaleY);
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x + 1, bottomRight.y - topLeft.y + 1);

        //ctx.beginPath();
        //ctx.strokeStyle = "white";
        //ctx.moveTo(bottomRight.x, topLeft.y);
        //ctx.lineTo(topLeft.x, topLeft.y);
        //ctx.stroke();
    }

    protected applyClipRegion(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();
        ctx.closePath();
    }

    applyTransform = this._isOrientedUp
        ?
        function (ctx: CanvasRenderingContext2D) {
            if (this.isTransformed) return;

            ctx.save();

            ctx.transform(
                1,
                0,
                0,
                -1,
                0,
                this.maxY + this.y);

            this.applyClipRegion(ctx);
            this._isTransformed = true;
        }
        :
        function (ctx: CanvasRenderingContext2D) {
            if (this.isTransformed) return;

            ctx.save();
            this.applyClipRegion(ctx);
            this._isTransformed = true;
        };

    restoreTransform(ctx: CanvasRenderingContext2D) {
        if (!this.isTransformed) return;

        ctx.restore();
        this._isTransformed = false;
    }

    protected calcScreenOffsets() {
        this._screenBottomRight = new Vector2D(
            this.screenLeft + this.screenWidth - 1,
            this.screenTop + this.screenHeight - 1);

        this._boundsToScreenScaleX = this.screenWidth / this.width;
        this._boundsToScreenScaleY = this.screenHeight / this.height;
        this._screenToBoundsScaleX = this.width / this.screenWidth;
        this._screenToBoundsScaleY = this.height / this.screenHeight;

        if (this._isOrientedUp) {
            let firstValue = this.screenTop;
            this._boundsToScreenOffsetY = firstValue + this.screenBottom;
            firstValue = this.y;
            this._screenToBoundsOffsetY = firstValue + this.maxY;
        }
    }

    protected flipBoundsToScreenY = this._isOrientedUp
        ? function (y: number): number { return this._boundsToScreenOffsetY - y; }
        : function (y: number): number { return y; };

    protected flipScreenToBoundsY = this._isOrientedUp
        ? function (y: number): number { return this._screenToBoundsOffsetY - y; }
        : function (y: number): number { return y; };

    toScreen(v: Vector2D): Vector2D {
        let x = (v.x - this.x) * this.boundsToScreenScaleX + this.screenLeft;
        let y = (v.y - this.y) * this.boundsToScreenScaleY + this.screenTop;
        y = this.flipBoundsToScreenY(y);
        return new Vector2D(x, y);
    }

    toWorld(v: Vector2D): Vector2D {
        let x = (v.x - this.screenLeft) * this.screenToBoundsScaleX + this.x;
        let y = (v.y - this.screenTop) * this.screenToBoundsScaleY + this.y;
        y = this.flipScreenToBoundsY(y);
        return new Vector2D(x, y);
    }
}
