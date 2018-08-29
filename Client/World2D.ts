class World2D extends ReadonlyBounds {
    private _viewport: Viewport2D;
    private _characters: Character[] = [];

    constructor(
        protected readonly _ctx: CanvasRenderingContext2D,
        orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number,
        protected readonly _viewportWidth: number,
        protected readonly _viewportHeight: number) {
        super(orientation, x, y, width, height);

        this._viewportWidth = Math.min(this._viewportWidth, this._width);
        this._viewportHeight = Math.min(this._viewportHeight, this._height);
        this._viewportWidth = Math.min(this._viewportWidth, _ctx.canvas.width);
        this._viewportHeight = Math.min(this._viewportHeight, _ctx.canvas.height);

        this.createViewport(this._x, this._y);
    }

    get viewport() { return this._viewport; }

    protected createViewport(x: number, y: number) {
        this._viewport = new Viewport2D(
            this._ctx,
            this._orientation,
            x,
            y,
            this._viewportWidth,
            this._viewportHeight);
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

    render(frame: number) {
        this._viewport.applyTransform();

        this._characters.forEach(character => character.draw(this._ctx, frame));

        this._viewport.restoreTransform();
    }

    localizeDegrees = this._isOrientedUp
        ? function (degrees: number) { return degrees < 0 || degrees > 360 ? degrees % 360 : degrees; }
        : function (degrees: number) {
            if (degrees < 0 || degrees > 360)
                degrees = degrees % 360;

            return 360 - degrees;
        };
}
