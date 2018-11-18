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
    function World2D(_ctx, orientation, x, y, width, height, _screenX, _screenY, screenWidth, screenHeight, viewportWidth, viewportHeight) {
        var _this = _super.call(this, orientation, x, y, width, height) || this;
        _this._ctx = _ctx;
        _this._screenX = _screenX;
        _this._screenY = _screenY;
        _this._pixelsPerMeter = Physics.pixelsPerMeter;
        _this._viewports = [];
        _this._forces = [];
        _this._characters = [];
        _this._beforeRenderViewport = World2D.defaultBeforeRenderViewport;
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
                    return this.setViewportTopLeft(this.viewport.left, this.viewport.top + dy);
                }
            :
                function (dy) {
                    return this.setViewportTopLeft(this.viewport.left, this.viewport.top + -dy);
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
        if (!screenWidth)
            screenWidth = _this.width;
        if (!screenHeight)
            screenHeight = _this.height;
        if (!viewportWidth)
            viewportWidth = screenWidth;
        if (!viewportHeight)
            viewportHeight = screenHeight;
        _this._viewportWidth = Math.min(viewportWidth, _this.width);
        _this._viewportHeight = Math.min(viewportHeight, _this.height);
        _this._screenWidth = screenWidth;
        _this._screenHeight = screenHeight;
        _this.setGravity(Physics.gravityEarth);
        _this.createViewport(_this.x, _this.y);
        return _this;
    }
    Object.defineProperty(World2D.prototype, "ctx", {
        get: function () { return this._ctx; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "gravity", {
        get: function () { return this._gravity; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "viewport", {
        get: function () { return this._viewports[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "viewports", {
        get: function () { return this._viewports; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "characters", {
        get: function () { return this._characters; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "beforeRenderViewport", {
        get: function () { return this._beforeRenderViewport; },
        set: function (value) { this._beforeRenderViewport = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "pixelsPerMeter", {
        get: function () { return this._pixelsPerMeter; },
        set: function (value) { this._pixelsPerMeter = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "tag", {
        get: function () { return this._tag; },
        set: function (value) { this._tag = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World2D.prototype, "containerBounds", {
        get: function () {
            if (!this._containerBounds) {
                this._containerBounds = new ContainerBounds(this.orientation, this.x, this.y, this.width, this.height);
            }
            return this._containerBounds;
        },
        enumerable: true,
        configurable: true
    });
    World2D.prototype.applyTransform = function () { this.viewport.applyTransform(); };
    World2D.prototype.restoreTransform = function () { this.viewport.restoreTransform(); };
    World2D.prototype.setGravity = function (gravityConst) {
        if (this._gravity)
            this.removeForce(this._gravity);
        this._gravity = new Gravity(this.orientation, gravityConst, this.origin, this.width, this.height);
        this.addForce(this._gravity);
    };
    World2D.prototype.setViewport = function (viewport) {
        if (this._viewports.length > 0)
            this._viewports.shift();
        this._viewports.unshift(viewport);
    };
    World2D.prototype.createViewport = function (x, y) {
        var viewport = new Viewport2D(this._ctx, this._orientation, x, y, this._viewportWidth, this._viewportHeight, this._screenX, this._screenY, this._screenWidth, this._screenHeight);
        this.setViewport(viewport);
    };
    World2D.prototype.addExistingViewport = function (viewport) {
        this._viewports.push(viewport);
        return viewport;
    };
    World2D.prototype.addViewport = function (x, y, width, height, screenX, screenY, ctx, screenWidth, screenHeight) {
        if (x > this.maxX)
            x = this.maxX - width;
        if (y > this.maxY)
            y = this.maxY - height;
        if (x < this.x)
            x = this.x;
        if (y < this.y)
            y = this.y;
        width = Math.min(width, this.maxX - x);
        height = Math.min(height, this.maxY - y);
        if (!ctx)
            ctx = this.ctx;
        var viewport = new Viewport2D(ctx, this._orientation, x, y, width, height, screenX, screenY, screenWidth, screenHeight);
        return this.addExistingViewport(viewport);
    };
    World2D.prototype.removeViewport = function (viewport) { this._viewports.remove(viewport); };
    World2D.prototype.moveViewportHorizontal = function (dx) {
        return this.setViewportTopLeft(this.viewport.left + dx, this.viewport.top);
    };
    World2D.prototype.addForce = function (force) { this._forces.push(force); };
    World2D.prototype.removeForce = function (force) { this._forces.remove(force); };
    World2D.prototype.addCharacter = function (character) { this._characters.push(character); };
    World2D.prototype.removeCharacter = function (character) { this._characters.remove(character); };
    World2D.prototype.update = function (frame, now, elapsedTime, timeScale) {
        var _this = this;
        timeScale = elapsedTime;
        this._characters.forEach(function (character) { return character.preUpdate(frame, now, elapsedTime, timeScale, _this); }, this);
        this._forces.forEach(function (force) {
            force.calculateForce();
            _this._characters.forEach(function (character) { return force.applyForceTo(character); }, _this);
        }, this);
        this._characters.forEach(function (character) {
            character.update(frame, now, elapsedTime, timeScale, _this);
            character.postUpdate(frame, now, elapsedTime, timeScale, _this);
        }, this);
    };
    World2D.prototype.render = function (frame) {
        var _this = this;
        this._viewports.forEach(function (viewport) {
            viewport.applyTransform();
            _this._beforeRenderViewport(viewport);
            _this._characters.forEach(function (character) { return character.draw(viewport, frame); });
            viewport.restoreTransform();
        }, this);
    };
    World2D.defaultBeforeRenderViewport = function (viewport) { };
    return World2D;
}(OrientedBounds));
//# sourceMappingURL=World2D.js.map