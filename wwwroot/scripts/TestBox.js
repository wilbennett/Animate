"use strict";
var TestBox = /** @class */ (function () {
    function TestBox(x, y, w, h, margin) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.margin = margin;
        this._origX = x;
        this._origY = y;
        this.radiusX = w / 2;
        this.radiusY = h / 2;
    }
    Object.defineProperty(TestBox.prototype, "radius", {
        get: function () { return this.radiusX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestBox.prototype, "right", {
        get: function () { return this.x + this.w - 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestBox.prototype, "bottom", {
        get: function () { return this.y + this.h - 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestBox.prototype, "center", {
        get: function () { return new Vector2D(this.x + this.radius, this.y + this.radius); },
        enumerable: true,
        configurable: true
    });
    TestBox.prototype.reset = function () {
        this.x = this._origX;
        this.y = this._origY;
    };
    TestBox.prototype.moveRight = function () { this.x = this.x + this.w + this.margin; };
    TestBox.prototype.moveDown = function () { this.y = this.y + this.h + this.margin; };
    TestBox.prototype.moveUp = function () { this.y = this.y - this.h - this.margin; };
    TestBox.prototype.moveUpRight = function () {
        this.moveUp();
        this.moveRight();
    };
    TestBox.prototype.offsetTopLeft = function (dx, dy) { return new Vector2D(this.x + dx, this.y + dy); };
    TestBox.prototype.offsetBottomRight = function (dx, dy) { return new Vector2D(this.right + dx, this.bottom + dy); };
    return TestBox;
}());
//# sourceMappingURL=TestBox.js.map