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
var World2D = /** @class */ (function (_super) {
    __extends(World2D, _super);
    function World2D(_ctx, orientation, x, y, width, height, _viewportWidth, _viewportHeight) {
        var _this = _super.call(this, orientation, x, y, width, height) || this;
        _this._ctx = _ctx;
        _this._viewportWidth = _viewportWidth;
        _this._viewportHeight = _viewportHeight;
        _this._characters = [];
        _this.setViewportTopLeft = _this._isOrientedUp
            ?
                function (x, y) {
                    var result = true;
                    var maxRight = this._width - this._viewportWidth + this.left;
                    var minBottom = this.top - this._height + this._viewportHeight;
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
                function (x, y) {
                    var result = true;
                    var maxRight = this._width - this._viewportWidth + this.left;
                    var maxBottom = this._height - this._viewportHeight + this.top;
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
        _this.moveViewportVertical = _this._isOrientedUp
            ?
                function (dy) {
                    return this.setViewportTopLeft(this._viewport.left, this.viewport.top + dy);
                }
            :
                function (dy) {
                    return this.setViewportTopLeft(this._viewport.left, this.viewport.top + -dy);
                };
        _this.centerViewportAt = _this._isOrientedUp
            ?
                function (x, y) {
                    return this.setViewportTopLeft(x - this.viewport.width / 2, y + this.viewport.height / 2);
                }
            :
                function (x, y) {
                    return this.setViewportTopLeft(x - this.viewport.width / 2, y - this.viewport.height / 2);
                };
        _this.localizeDegrees = _this._isOrientedUp
            ? function (degrees) { return degrees < 0 || degrees > 360 ? degrees % 360 : degrees; }
            : function (degrees) {
                if (degrees < 0 || degrees > 360)
                    degrees = degrees % 360;
                return 360 - degrees;
            };
        _this._viewportWidth = Math.min(_this._viewportWidth, _this._width);
        _this._viewportHeight = Math.min(_this._viewportHeight, _this._height);
        _this._viewportWidth = Math.min(_this._viewportWidth, _ctx.canvas.width);
        _this._viewportHeight = Math.min(_this._viewportHeight, _ctx.canvas.height);
        _this.createViewport(_this._x, _this._y);
        return _this;
    }
    Object.defineProperty(World2D.prototype, "viewport", {
        get: function () { return this._viewport; },
        enumerable: true,
        configurable: true
    });
    World2D.prototype.createViewport = function (x, y) {
        this._viewport = new Viewport2D(this._ctx, this._orientation, x, y, this._viewportWidth, this._viewportHeight);
    };
    World2D.prototype.moveViewportHorizontal = function (dx) {
        return this.setViewportTopLeft(this._viewport.left + dx, this.viewport.top);
    };
    World2D.prototype.addCharacter = function (character) {
        this._characters.push(character);
    };
    World2D.prototype.removeCharacter = function (character) {
        var index = this._characters.indexOf(character);
        if (index >= 0)
            this._characters.splice(index, 1);
    };
    World2D.prototype.update = function (frame, timestamp, delta) {
        var _this = this;
        this._characters.forEach(function (character) { return character.preUpdate(frame, timestamp, delta); }, this);
        this._characters.forEach(function (character) { return character.update(frame, timestamp, delta, _this._characters); }, this);
    };
    World2D.prototype.render = function (frame) {
        var _this = this;
        this._viewport.applyTransform();
        this._characters.forEach(function (character) { return character.draw(_this._ctx, frame); });
        this._viewport.restoreTransform();
    };
    return World2D;
}(ReadonlyBounds));
//# sourceMappingURL=World2D.js.map