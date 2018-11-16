class World2D extends OrientedBounds {
    protected readonly _viewportWidth: number;
    protected readonly _viewportHeight: number;
    protected readonly _screenWidth: number;
    protected readonly _screenHeight: number;
    private _pixelsPerMeter: number = Physics.pixelsPerMeter;
    private _containerBounds: ContainerBounds;
    private _gravity: Gravity;
    private _viewports: Viewport2D[] = [];
    private _forces: Force[] = [];
    private _characters: Character[] = [];
    private _beforeRenderViewport: (viewport: Viewport2D) => void = World2D.defaultBeforeRenderViewport;

    constructor(
        private _ctx: CanvasRenderingContext2D,
        orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number,
        protected readonly _screenX: number,
        protected readonly _screenY: number,
        screenWidth?: number,
        screenHeight?: number,
        viewportWidth?: number,
        viewportHeight?: number) {
        super(orientation, x, y, width, height);

        if (!screenWidth) screenWidth = this.width;
        if (!screenHeight) screenHeight = this.height;

        if (!viewportWidth) viewportWidth = screenWidth;
        if (!viewportHeight) viewportHeight = screenHeight;

        this._viewportWidth = Math.min(viewportWidth, this.width);
        this._viewportHeight = Math.min(viewportHeight, this.height);

        this._screenWidth = screenWidth;
        this._screenHeight = screenHeight;

        this.setGravity(Physics.gravityEarth);
        this.createViewport(this.x, this.y);
    }

    get ctx() { return this._ctx; }
    get gravity() { return this._gravity; }
    get viewport() { return this._viewports[0]; }
    get viewports() { return this._viewports; }
    get characters() { return this._characters; }

    get beforeRenderViewport() { return this._beforeRenderViewport; }
    set beforeRenderViewport(value: (viewport: Viewport2D) => void) { this._beforeRenderViewport = value; }

    get pixelsPerMeter() { return this._pixelsPerMeter; }
    set pixelsPerMeter(value: number) { this._pixelsPerMeter = value; }

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

    applyTransform() { this.viewport.applyTransform(); }
    restoreTransform() { this.viewport.restoreTransform(); }

    setGravity(gravityConst: number) {
        if (this._gravity) this.removeForce(this._gravity);

        this._gravity = new Gravity(this.orientation, gravityConst);
        this.addForce(this._gravity);
    }

    private setViewport(viewport: Viewport2D) {
        if (this._viewports.length > 0)
            this._viewports.shift();

        this._viewports.unshift(viewport);
    }

    protected createViewport(x: number, y: number) {
        let viewport = new Viewport2D(
            this._ctx,
            this._orientation,
            x,
            y,
            this._viewportWidth,
            this._viewportHeight,
            this._screenX,
            this._screenY,
            this._screenWidth,
            this._screenHeight);

        this.setViewport(viewport);
    }

    addExistingViewport(viewport: Viewport2D) {
        this._viewports.push(viewport);
        return viewport;
    }

    addViewport(
        x: number,
        y: number,
        width: number,
        height: number,
        screenX: number,
        screenY: number,
        ctx?: CanvasRenderingContext2D,
        screenWidth?: number,
        screenHeight?: number): Viewport2D {

        if (x > this.maxX) x = this.maxX - width;
        if (y > this.maxY) y = this.maxY - height;

        if (x < this.x) x = this.x;
        if (y < this.y) y = this.y;

        width = Math.min(width, this.maxX - x);
        height = Math.min(height, this.maxY - y);

        if (!ctx) ctx = this.ctx;

        let viewport = new Viewport2D(
            ctx,
            this._orientation,
            x,
            y,
            width,
            height,
            screenX,
            screenY,
            screenWidth,
            screenHeight);

        return this.addExistingViewport(viewport);
    }

    removeViewport(viewport: Viewport2D) { this._viewports.remove(viewport); }

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
        return this.setViewportTopLeft(this.viewport.left + dx, this.viewport.top);
    }

    moveViewportVertical = this._isOrientedUp
        ?
        function (dy: number) {
            return this.setViewportTopLeft(this.viewport.left, this.viewport.top + dy);
        }
        :
        function (dy: number) {
            return this.setViewportTopLeft(this.viewport.left, this.viewport.top + -dy);
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

    addForce(force: Force) { this._forces.push(force); }
    removeForce(force: Force) { this._forces.remove(force); }

    addCharacter(character: Character) { this._characters.push(character); }
    removeCharacter(character: Character) { this._characters.remove(character); }

    update(frame: number, now: DOMHighResTimeStamp, timeDelta: number) {
        this._characters.forEach(character => character.preUpdate(frame, now, timeDelta), this);

        this._forces.forEach(force => {
            force.calculateForce();
            this._characters.forEach(character => force.applyForceTo(character), this);
        }, this);

        this._characters.forEach(character => character.update(frame, now, timeDelta, this), this);
    }

    render(frame: number) {
        this._viewports.forEach(viewport => {
            viewport.applyTransform();
            this._beforeRenderViewport(viewport);
            this._characters.forEach(character => character.draw(viewport, frame));
            viewport.restoreTransform();
        }, this);
    }

    localizeDegrees = this._isOrientedUp
        ? function (degrees: number) { return degrees < 0 || degrees > 360 ? degrees % 360 : degrees; }
        : function (degrees: number) {
            if (degrees < 0 || degrees > 360)
                degrees = degrees % 360;

            return 360 - degrees;
        };

    private static defaultBeforeRenderViewport(viewport: Viewport2D) { }
}
