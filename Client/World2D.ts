class World2D extends OrientedBounds {
    protected readonly _viewportWidth: number;
    protected readonly _viewportHeight: number;
    protected readonly _screenWidth: number;
    protected readonly _screenHeight: number;
    private _containerBounds: ContainerBounds;
    private _viewport: Viewport2D;
    private _characters: Character[] = [];

    constructor(
        orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number,
        protected readonly _screenX: number,
        protected readonly _screenY: number,
        viewportWidth?: number,
        viewportHeight?: number,
        screenWidth?: number,
        screenHeight?: number) {
        super(orientation, x, y, width, height);

        if (!viewportWidth) viewportWidth = this.width;
        if (!viewportHeight) viewportHeight = this.height;

        if (!screenWidth) screenWidth = viewportWidth;
        if (!screenHeight) screenHeight = viewportHeight;

        this._viewportWidth = Math.min(viewportWidth, this.width);
        this._viewportHeight = Math.min(viewportHeight, this.height);

        this._screenWidth = screenWidth;
        this._screenHeight = screenHeight;

        this.createViewport(this.x, this.y);
    }

    get viewport() { return this._viewport; }

    get containerBounds() {
        if (!this._containerBounds) {
            this._containerBounds = new ContainerBounds(
                this.orientation,
                this.x,
                this.y,
                this.width,
                this.height);
        }

        return this._containerBounds;
    }

    applyTransform = function(ctx: CanvasRenderingContext2D) { this.viewport.applyTransform(ctx); }
    restoreTransform(ctx: CanvasRenderingContext2D) { this.viewport.restoreTransform(ctx); }

    protected createViewport(x: number, y: number) {
        this._viewport = new Viewport2D(
            this._orientation,
            x,
            y,
            this._viewportWidth,
            this._viewportHeight,
            this._screenX,
            this._screenY,
            this._screenWidth,
            this._screenHeight);
    }

    setViewportTopLeft = this._isOrientedUp
        ?
        function (x: number, y: number) {
            let result = true;
            let maxRight = this._width - this._viewportWidth + this.left;
            let minBottom = this.top - this._height + this._viewportHeight;

            if (x < this.left) {
                x = this.left;
                result = false;
            }

            if (x > maxRight) {
                x = maxRight;
                result = false;
            }

            if (y > this.top) {
                y = this.top;
                result = false;
            }

            if (y < minBottom) {
                y = minBottom;
                result = false;
            }

            this.createViewport(x, y - this._viewportHeight + 1);
            return result;
        }
        :
        function (x: number, y: number) {
            let result = true;
            let maxRight = this._width - this._viewportWidth + this.left;
            let maxBottom = this._height - this._viewportHeight + this.top;

            if (x < this.left) {
                x = this.left;
                result = false;
            }

            if (x > maxRight) {
                x = maxRight;
                result = false;
            }

            if (y < this.top) {
                y = this.top;
                result = false;
            }

            if (y > maxBottom) {
                y = maxBottom;
                result = false;
            }

            this.createViewport(x, y);
            return result;
        };

    moveViewportHorizontal(dx: number) {
        return this.setViewportTopLeft(this._viewport.left + dx, this.viewport.top);
    }

    moveViewportVertical = this._isOrientedUp
        ?
        function (dy: number) {
            return this.setViewportTopLeft(this._viewport.left, this.viewport.top + dy);
        }
        :
        function (dy: number) {
            return this.setViewportTopLeft(this._viewport.left, this.viewport.top + -dy);
        };

    centerViewportAt = this._isOrientedUp
        ?
        function (x: number, y: number) {
            return this.setViewportTopLeft(x - this.viewport.width / 2, y + this.viewport.height / 2);
        }
        :
        function (x: number, y: number) {
            return this.setViewportTopLeft(x - this.viewport.width / 2, y - this.viewport.height / 2);
        };

    addCharacter(character: Character) {
        this._characters.push(character);
    }

    removeCharacter(character: Character) {
        let index = this._characters.indexOf(character);

        if (index >= 0)
            this._characters.splice(index, 1);
    }

    update(frame: number, timestamp: DOMHighResTimeStamp, delta: number) {
        this._characters.forEach(character => character.preUpdate(frame, timestamp, delta), this);
        this._characters.forEach(character => character.update(frame, timestamp, delta, this._characters), this);
    }

    render(ctx: CanvasRenderingContext2D, frame: number) {
        this.applyTransform(ctx);

        this._characters.forEach(character => character.draw(ctx, frame));

        this.restoreTransform(ctx);
    }

    localizeDegrees = this._isOrientedUp
        ? function (degrees: number) { return degrees < 0 || degrees > 360 ? degrees % 360 : degrees; }
        : function (degrees: number) {
            if (degrees < 0 || degrees > 360)
                degrees = degrees % 360;

            return 360 - degrees;
        };
}
