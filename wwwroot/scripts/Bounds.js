"use strict";
var Bounds = /** @class */ (function () {
    function Bounds(x, y, _width, _height) {
        this._width = _width;
        this._height = _height;
        this.isAbove = function (sourceY, targetY) { return sourceY < targetY; };
        this.isBelow = function (sourceY, targetY) { return sourceY > targetY; };
        this._origin = new Vector2D(x, y);
        this._maxX = this.x + this.width - 1;
        this._maxY = this.y + this.height - 1;
    }
    Object.defineProperty(Bounds.prototype, "maxX", {
        get: function () { return this._maxX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "maxY", {
        get: function () { return this._maxY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "x", {
        get: function () { return this.origin.x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "y", {
        get: function () { return this.origin.y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "width", {
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "height", {
        get: function () { return this._height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "w", {
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "h", {
        get: function () { return this._height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "left", {
        get: function () { return this.x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "right", {
        get: function () { return this.maxX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "origin", {
        get: function () { return this._origin; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "topLeft", {
        get: function () {
            if (!this._topLeft)
                this._topLeft = this.origin;
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "bottomRight", {
        get: function () {
            if (!this._bottomRight)
                this._bottomRight = new Vector2D(this.right, this.maxY);
            return this._bottomRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "bottomLeft", {
        get: function () {
            if (!this._bottomLeft)
                this._bottomLeft = new Vector2D(this.topLeft.x, this.bottomRight.y);
            return this._bottomLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "topRight", {
        get: function () {
            if (!this._topRight)
                this._topRight = new Vector2D(this.right, this.topLeft.y);
            return this._topRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "top", {
        get: function () { return this.topLeft.y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "bottom", {
        get: function () { return this.bottomLeft.y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "center", {
        get: function () {
            if (!this._center)
                this._center = new Vector2D(this.x + this.width / 2, this.y + this.height / 2);
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "centerX", {
        get: function () { return this.center.x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "centerY", {
        get: function () { return this.center.y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "boundsArray", {
        get: function () {
            if (!this._boundsArray)
                this._boundsArray = [this.x, this.y, this.width, this.height];
            return this._boundsArray;
        },
        enumerable: true,
        configurable: true
    });
    Bounds.prototype.toString = function () {
        return "((" + this.left.toFixed(0) + ", " + this.bottom.toFixed(0) + "), (" + this.right.toFixed(0) + ", " + this.top.toFixed(0) + "))";
    };
    Bounds.prototype.inflate = function (dx, dy) {
        var x = this.x - dx;
        var y = this.y - dy;
        var width = this.width + dx + dx;
        var height = this.height + dy + dy;
        if (width < 0 && height < 0) {
            x = this.x;
            y = this.y;
            width = 0;
            height = 0;
        }
        else if (width < 0) {
            x = this.x;
            width = 0;
            height = height;
        }
        else if (height < 0) {
            y = this.y;
            width = width;
            height = 0;
        }
        return new Bounds(x, y, width, height);
    };
    Bounds.prototype.draw = function (ctx, width, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        //ctx.moveTo(this.x, this.top);
        //ctx.lineTo(this.x, this.bottom);
        //ctx.lineTo(this.right, this.bottom);
        //ctx.lineTo(this.right, this.top);
        //ctx.lineTo(this.x, this.top);
        //ctx.stroke();
        ctx.strokeRect(this.x, this.top, this.width, this.height);
    };
    Bounds.prototype.leftOffset = function (x) { return this.left + x; };
    Bounds.prototype.rightOffset = function (x) { return this.right - x; };
    Bounds.prototype.topOffsetAbove = function (delta) { return this.top - delta; };
    Bounds.prototype.topOffsetBelow = function (delta) { return this.top + delta; };
    Bounds.prototype.bottomOffsetAbove = function (delta) { return this.bottom - delta; };
    Bounds.prototype.bottomOffsetBelow = function (delta) { return this.bottom + delta; };
    Bounds.prototype.offsetAbove = function (y, delta) { return y - delta; };
    Bounds.prototype.offsetBelow = function (y, delta) { return y + delta; };
    Bounds.prototype.leftPenetration = function (x) { return this.left - x; };
    Bounds.prototype.rightPenetration = function (x) { return x - this.right; };
    Bounds.prototype.topPenetration = function (y) { return this.top - y; };
    Bounds.prototype.bottomPenetration = function (y) { return y - this.bottom; };
    Bounds.prototype.isUp = function (y) { return y < 0; };
    Bounds.prototype.isDown = function (y) { return y > 0; };
    Bounds.prototype.contains = function (point) {
        return point.x >= this.x && point.x <= this.maxX && point.y >= this.y && point.y <= this.maxY;
    };
    Bounds.prototype.intersectsWith = function (other) {
        return this.x <= other.maxX && this.maxX >= other.x
            && this.y <= other.maxY && this.maxY >= other.y;
    };
    return Bounds;
}());
//# sourceMappingURL=Bounds.js.map