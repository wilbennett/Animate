class ContainerBounds extends OrientedBounds {
    private _leftBound: Line2D;
    private _topBound: Line2D;
    private _rightBound: Line2D;
    private _bottomBound: Line2D;

    constructor(
        orientation: WorldOrientation,
        x: number,
        y: number,
        width: number,
        height: number) {
        super(orientation, x, y, width, height);
    }

    get leftBound() {
        if (!this._leftBound) {
            // Change direction of line so normal points inward.
            if (this._isOrientedUp) {
                this._leftBound = new Line2D(this.bottomLeft, this.topLeft);
            } else {
                this._leftBound = new Line2D(this.topLeft, this.bottomLeft);
            }
            //this._leftBound = new Ray2D(this._leftBound.origin, this._leftBound.direction, this._leftBound.length);
        }

        return this._leftBound;
    }

    get topBound() {
        if (!this._topBound) {
            if (this._isOrientedUp) {
                this._topBound = new Line2D(this.topLeft, this.topRight);
            }
            else {
                this._topBound = new Line2D(this.topRight, this.topLeft);
            }
            //this._topBound = new Ray2D(this._topBound.origin, this._topBound.direction, this._topBound.length);
        }

        return this._topBound;
    }

    get rightBound() {
        if (!this._rightBound) {
            if (this._isOrientedUp) {
                this._rightBound = new Line2D(this.topRight, this.bottomRight);
            }
            else {
                this._rightBound = new Line2D(this.bottomRight, this.topRight);
            }
            //this._rightBound = new Ray2D(this._rightBound.origin, this._rightBound.direction, this._rightBound.length);
        }

        return this._rightBound;
    }

    get bottomBound() {
        if (!this._bottomBound) {
            if (this._isOrientedUp) {
                this._bottomBound = new Line2D(this.bottomRight, this.bottomLeft);
            }
            else {
                this._bottomBound = new Line2D(this.bottomLeft, this.bottomRight);
            }
            //this._bottomBound = new Ray2D(this._bottomBound.origin, this._bottomBound.direction, this._bottomBound.length);
        }

        return this._bottomBound;
    }

    //*
    draw(ctx: CanvasRenderingContext2D, width: number, color: string, bounds?: OrientedBounds) {
        super.draw(ctx, width, color, bounds);

        if (bounds) {
            width = width * Math.max(bounds.boundsToScreenScaleX, bounds.boundsToScreenScaleY);
        }

        //this.leftBound.draw(ctx, width, color, bounds);
        let normalLength = this.width / 3;
        let normal = new Ray2D(new Vector2D(this.left, this.centerY), this.leftBound.normal, normalLength);
        normal.draw(ctx, width, "red", bounds);
        //this.bottomBound.draw(ctx, width, color, bounds);
        normalLength = this.height / 3;
        normal = new Ray2D(new Vector2D(this.centerX, this.bottom), this.bottomBound.normal, normalLength);
        normal.draw(ctx, width, "red", bounds);
        //this.rightBound.draw(ctx, width, color, bounds);
        normalLength = this.width / 3;
        normal = new Ray2D(new Vector2D(this.right, this.centerY), this.rightBound.normal, normalLength);
        normal.draw(ctx, width, "red", bounds);
        //this.topBound.draw(ctx, width, color, bounds);
        //this.topBound.draw(ctx, width, "white", bounds);
        normalLength = this.height / 3;
        normal = new Ray2D(new Vector2D(this.centerX, this.top), this.topBound.normal, normalLength);
        normal.draw(ctx, width, "darkred", bounds);
    }
    //*/

    reflectLeft(velocity: Vector2D) {
        return this.leftBound.direction.reflect(velocity);
    }

    reflectTop(velocity: Vector2D) {
        return this.topBound.direction.reflect(velocity);
    }

    reflectRight(velocity: Vector2D) {
        return this.rightBound.direction.reflect(velocity);
    }

    reflectBottom(velocity: Vector2D) {
        return this.bottomBound.direction.reflect(velocity);
    }
}
