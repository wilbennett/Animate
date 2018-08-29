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
var Bounds = /** @class */ (function (_super) {
    __extends(Bounds, _super);
    function Bounds(orientation, x, y, width, height) {
        return _super.call(this, orientation, x, y, width, height) || this;
    }
    Object.defineProperty(Bounds.prototype, "x", {
        get: function () { return this._x; },
        set: function (value) { this._x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "left", {
        get: function () { return this._x; },
        set: function (value) { this.x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "y", {
        get: function () { return this._y; },
        set: function (value) { this._y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "top", {
        get: function () { return this.calcTop(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "width", {
        get: function () { return this._width; },
        set: function (value) { this._width = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "height", {
        get: function () { return this._height; },
        set: function (value) { this._height = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "right", {
        get: function () { return this.calcRight(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "bottom", {
        get: function () { return this.calcBottom(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "centerX", {
        get: function () { return this.calcCenterX(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "centerY", {
        get: function () { return this.calcCenterY(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "minY", {
        get: function () { return this.calcBottom(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "boundsArray", {
        get: function () { return this.calcBoundsArray(); },
        enumerable: true,
        configurable: true
    });
    Bounds.prototype.inflate = function (dx, dy) {
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
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        return this;
    };
    return Bounds;
}(ReadonlyBounds));
//# sourceMappingURL=Bounds.js.map