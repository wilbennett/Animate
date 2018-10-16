"use strict";
var ReadonlyBounds = /** @class */ (function () {
    function ReadonlyBounds(_orientation, _x, _y, _width, _height) {
        this._orientation = _orientation;
        this._x = _x;
        this._y = _y;
        this._width = _width;
        this._height = _height;
        this._isOrientedUp = this._orientation === WorldOrientation.Up;
        this.calcTop = this._isOrientedUp
            ? function () { return this._y + this._height - 1; }
            : function () { return this._y; };
        this.calcBottom = this._isOrientedUp
            ? function () { return this._y; }
            : function () { return this._y + this._height - 1; };
        this._right = this.calcRight();
        this._top = this.calcTop();
        this._bottom = this.calcBottom();
        this._minY = this._bottom;
        this._centerX = this.calcCenterX();
        this._centerY = this.calcCenterY();
        this._center = this.calcCenter();
        this._boundsArray = this.calcBoundsArray();
        this.topOffset = this._isOrientedUp
            ? function (y) { return this.top - 1 - y; }
            : function (y) { return this.top + y; };
        this.bottomOffset = this._isOrientedUp
            ? function (y) { return this.bottom + y; }
            : function (y) { return this.bottom - y; };
        this.offsetAbove = this._isOrientedUp
            ? function (y, delta) { return y + delta; }
            : function (y, delta) { return y - delta; };
        this.offsetBelow = this._isOrientedUp
            ? function (y, delta) { return y - delta; }
            : function (y, delta) { return y + delta; };
        this.topPenetration = this._isOrientedUp
            ? function (y) { return y - (this.top - 1); }
            : function (y) { return this.top - y; };
        this.bottomPenetration = this._isOrientedUp
            ? function (y) { return this.bottom - y; }
            : function (y) { return y - this.bottom; };
        this.isUp = this._isOrientedUp
            ? function (y) { return y > 0; }
            : function (y) { return y < 0; };
        this.isDown = this._isOrientedUp
            ? function (y) { return y < 0; }
            : function (y) { return y > 0; };
        this.toWorld = this._isOrientedUp
            ? function (x, y) { return [this.left + x, this.top - y]; }
            : function (x, y) { return [this.left + x, this.top + y]; };
        this.toScreen = this._isOrientedUp
            ? function (x, y) { return [x - this.left, this.top - y]; }
            : function (x, y) { return [x - this.left, y - this.top]; };
    }
    ReadonlyBounds.prototype.calcRight = function () { return this._x + this._width - 1; };
    ReadonlyBounds.prototype.calcCenterX = function () { return Math.round(this._x + this._width / 2); };
    ReadonlyBounds.prototype.calcCenterY = function () { return Math.round(this._y + this._height / 2); };
    ReadonlyBounds.prototype.calcCenter = function () { return new Vector2D(this.calcCenterX(), this.calcCenterY()); };
    ReadonlyBounds.prototype.calcBoundsArray = function () { return [this._x, this._y, this._width, this._height]; };
    Object.defineProperty(ReadonlyBounds.prototype, "orientation", {
        get: function () { return this._orientation; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "x", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "left", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "y", {
        get: function () { return this._y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "top", {
        get: function () { return this._top; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "width", {
        get: function () { return this._width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "height", {
        get: function () { return this._height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "right", {
        get: function () { return this._right; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "bottom", {
        get: function () { return this._bottom; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "centerX", {
        get: function () { return this._centerX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "centerY", {
        get: function () { return this._centerY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "center", {
        get: function () { return this._center; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "minX", {
        get: function () { return this._x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "minY", {
        get: function () { return this._minY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadonlyBounds.prototype, "boundsArray", {
        get: function () { return this._boundsArray; },
        enumerable: true,
        configurable: true
    });
    ReadonlyBounds.prototype.toString = function () {
        return "((" + this.left.toFixed(0) + ", " + this.bottom.toFixed(0) + "), (" + this.right.toFixed(0) + ", " + this.top.toFixed(0) + "))";
    };
    ReadonlyBounds.prototype.leftOffset = function (x) { return this.left + x; };
    ReadonlyBounds.prototype.rightOffset = function (x) { return this.right - x; };
    ReadonlyBounds.prototype.leftPenetration = function (x) { return this.left - x; };
    ReadonlyBounds.prototype.rightPenetration = function (x) { return x - this.right; };
    ReadonlyBounds.prototype.inflate = function (dx, dy) {
        var x = this._x - dx;
        var y = this._y - dy;
        var width = this.width + dx + dx;
        var height = this.height + dy + dy;
        if (width < 0 && height < 0) {
            x = this._x;
            y = this._y;
            width = 0;
            height = 0;
        }
        else if (width < 0) {
            x = this._x;
            width = 0;
            height = height;
        }
        else if (height < 0) {
            y = this._y;
            width = width;
            height = 0;
        }
        return new Bounds(this._orientation, x, y, width, height);
    };
    return ReadonlyBounds;
}());
//# sourceMappingURL=ReadonlyBounds.js.map