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
var OrientedBounds = /** @class */ (function (_super) {
    __extends(OrientedBounds, _super);
    function OrientedBounds(_orientation, x, y, width, height) {
        var _this = _super.call(this, x, y, width, height) || this;
        _this._orientation = _orientation;
        _this._isOrientedUp = _this._orientation === WorldOrientation.Up;
        _this.applyTransform = _this._isOrientedUp
            ?
                function (ctx) {
                    ctx.save();
                    ctx.transform(1, 0, 0, -1, 0, this.maxY + this.y);
                    this.applyClipRegion(ctx);
                }
            :
                function (ctx) {
                    ctx.save();
                    this.applyClipRegion(ctx);
                };
        _this.flipBoundsToScreenY = _this._isOrientedUp
            ? function (y) { return this._boundsToScreenOffsetY - y; }
            : function (y) { return y; };
        _this.flipScreenToBoundsY = _this._isOrientedUp
            ? function (y) { return this._screenToBoundsOffsetY - y; }
            : function (y) { return y; };
        _this._screenTopLeft = new Vector2D(_this.x, _this.y);
        _this._screenWidth = _this.width;
        _this._screenHeight = _this.height;
        _this.calcScreenOffsets();
        return _this;
    }
    Object.defineProperty(OrientedBounds.prototype, "orientation", {
        get: function () { return this._orientation; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "topLeft", {
        get: function () {
            if (!this._topLeft) {
                this._topLeft = this._isOrientedUp
                    ? new Vector2D(this.left, this.maxY)
                    : this.origin;
            }
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "bottomRight", {
        get: function () {
            if (!this._bottomRight) {
                this._bottomRight = this._isOrientedUp
                    ? new Vector2D(this.right, this.y)
                    : new Vector2D(this.right, this.maxY);
            }
            return this._bottomRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenLeft", {
        get: function () { return this._screenTopLeft.x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenTop", {
        get: function () { return this._screenTopLeft.y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenRight", {
        get: function () { return this._screenBottomRight.x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenBottom", {
        get: function () { return this._screenBottomRight.y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenWidth", {
        get: function () { return this._screenWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenHeight", {
        get: function () { return this._screenHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "boundsToScreenScaleX", {
        get: function () { return this._boundsToScreenScaleX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "boundsToScreenScaleY", {
        get: function () { return this._boundsToScreenScaleY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenToBoundsScaleX", {
        get: function () { return this._screenToBoundsScaleX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrientedBounds.prototype, "screenToBoundsScaleY", {
        get: function () { return this._screenToBoundsScaleY; },
        enumerable: true,
        configurable: true
    });
    OrientedBounds.prototype.topOffsetAbove = function (delta) {
        return this._isOrientedUp ? this.top + delta : _super.prototype.topOffsetAbove.call(this, delta);
    };
    OrientedBounds.prototype.topOffsetBelow = function (delta) {
        return this._isOrientedUp ? this.top - delta : _super.prototype.topOffsetBelow.call(this, delta);
    };
    OrientedBounds.prototype.bottomOffsetAbove = function (delta) {
        return this._isOrientedUp ? this.bottom + delta : _super.prototype.bottomOffsetAbove.call(this, delta);
    };
    OrientedBounds.prototype.bottomOffsetBelow = function (delta) {
        return this._isOrientedUp ? this.bottom - delta : _super.prototype.bottomOffsetBelow.call(this, delta);
    };
    OrientedBounds.prototype.offsetAbove = function (y, delta) { return this._isOrientedUp ? y + delta : y - delta; };
    OrientedBounds.prototype.offsetBelow = function (y, delta) { return this._isOrientedUp ? y - delta : y + delta; };
    OrientedBounds.prototype.topPenetration = function (y) { return this._isOrientedUp ? y - this.top : this.top - y; };
    OrientedBounds.prototype.bottomPenetration = function (y) { return this._isOrientedUp ? this.bottom - y : y - this.bottom; };
    OrientedBounds.prototype.isUp = function (y) { return this._isOrientedUp ? y > 0 : y < 0; };
    OrientedBounds.prototype.isDown = function (y) { return this._isOrientedUp ? y < 0 : y > 0; };
    OrientedBounds.prototype.draw = function (ctx, width, color, bounds) {
        var topLeft = this._screenTopLeft;
        var bottomRight = this._screenBottomRight;
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
    };
    OrientedBounds.prototype.applyClipRegion = function (ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();
        ctx.closePath();
    };
    OrientedBounds.prototype.restoreTransform = function (ctx) {
        ctx.restore();
    };
    OrientedBounds.prototype.calcScreenOffsets = function () {
        this._screenBottomRight = new Vector2D(this.screenLeft + this.screenWidth - 1, this.screenTop + this.screenHeight - 1);
        this._boundsToScreenScaleX = this.screenWidth / this.width;
        this._boundsToScreenScaleY = this.screenHeight / this.height;
        this._screenToBoundsScaleX = this.width / this.screenWidth;
        this._screenToBoundsScaleY = this.height / this.screenHeight;
        if (this._isOrientedUp) {
            var firstValue = this.screenTop;
            this._boundsToScreenOffsetY = firstValue + this.screenBottom;
            firstValue = this.y;
            this._screenToBoundsOffsetY = firstValue + this.maxY;
        }
    };
    OrientedBounds.prototype.toScreen = function (v) {
        var x = (v.x - this.x) * this.boundsToScreenScaleX + this.screenLeft;
        var y = (v.y - this.y) * this.boundsToScreenScaleY + this.screenTop;
        y = this.flipBoundsToScreenY(y);
        return new Vector2D(x, y);
    };
    OrientedBounds.prototype.toWorld = function (v) {
        var x = (v.x - this.screenLeft) * this.screenToBoundsScaleX + this.x;
        var y = (v.y - this.screenTop) * this.screenToBoundsScaleY + this.y;
        y = this.flipScreenToBoundsY(y);
        return new Vector2D(x, y);
    };
    return OrientedBounds;
}(Bounds));
//# sourceMappingURL=OrientedBounds.js.map