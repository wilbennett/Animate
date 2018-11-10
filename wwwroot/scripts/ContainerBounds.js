"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ContainerBounds = /** @class */ (function (_super) {
    __extends(ContainerBounds, _super);
    function ContainerBounds(orientation, x, y, width, height) {
        return _super.call(this, orientation, x, y, width, height) || this;
    }
    Object.defineProperty(ContainerBounds.prototype, "leftBound", {
        get: function () {
            if (!this._leftBound) {
                // Change direction of line so normal points inward.
                if (this._isOrientedUp) {
                    this._leftBound = new Line2D(this.bottomLeft, this.topLeft);
                }
                else {
                    this._leftBound = new Line2D(this.topLeft, this.bottomLeft);
                }
                //this._leftBound = new Ray2D(this._leftBound.origin, this._leftBound.direction, this._leftBound.length);
            }
            return this._leftBound;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainerBounds.prototype, "topBound", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainerBounds.prototype, "rightBound", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainerBounds.prototype, "bottomBound", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    //*
    ContainerBounds.prototype.draw = function (ctx, width, color, bounds) {
        _super.prototype.draw.call(this, ctx, width, color, bounds);
        if (bounds) {
            width = width * Math.max(bounds.boundsToScreenScaleX, bounds.boundsToScreenScaleY);
        }
        //this.leftBound.draw(ctx, width, color, bounds);
        var normalLength = this.width / 3;
        var normal = new Ray2D(new Vector2D(this.left, this.centerY), this.leftBound.normal, normalLength);
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
    };
    //*/
    ContainerBounds.prototype.reflectLeft = function (velocity) {
        return this.leftBound.direction.reflect(velocity);
    };
    ContainerBounds.prototype.reflectTop = function (velocity) {
        return this.topBound.direction.reflect(velocity);
    };
    ContainerBounds.prototype.reflectRight = function (velocity) {
        return this.rightBound.direction.reflect(velocity);
    };
    ContainerBounds.prototype.reflectBottom = function (velocity) {
        return this.bottomBound.direction.reflect(velocity);
    };
    return ContainerBounds;
}(OrientedBounds));
//# sourceMappingURL=ContainerBounds.js.map