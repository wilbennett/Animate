"use strict";
var LocInfo = /** @class */ (function () {
    function LocInfo(x, y, _left, _top, _right, _bottom) {
        this.x = x;
        this.y = y;
        this._left = _left;
        this._top = _top;
        this._right = _right;
        this._bottom = _bottom;
        this._deltaX = 0;
        this._deltaY = -1;
    }
    LocInfo.prototype.advance = function () {
        this.x += this._deltaX;
        this.y += this._deltaY;
        //this._ry = this._rCenterY - this._rNormalLength; 
        //this._ry = this._rTop;
        if (this.x < this._left) {
            this.x = this._left;
            this._deltaX = 0;
            this._deltaY = -1;
        }
        if (this.x > this._right) {
            this.x = this._right;
            this._deltaX = 0;
            this._deltaY = 1;
        }
        if (this.y < this._top) {
            this.y = this._top;
            this._deltaY = 0;
            this._deltaX = 1;
        }
        if (this.y > this._bottom) {
            this.y = this._bottom;
            this._deltaY = 0;
            this._deltaX = -1;
        }
    };
    return LocInfo;
}());
var TestVector = /** @class */ (function () {
    function TestVector(_canvas) {
        var _this = this;
        this._canvas = _canvas;
        this.animLoop = function () {
            var ctx = _this._ctx;
            ctx.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
            var rotDegrees = 1;
            var inDegrees = rotDegrees * 1.2;
            _this._rRayStart = _this._rRayStart.rotateDegreesAbout(rotDegrees, _this._rCenter);
            _this._rRayInStart = _this._rRayInStart.rotateDegreesAbout(inDegrees, _this._rCenter);
            _this.testRay(_this._rRayStart, _this._rRayInStart, _this._rCenter, _this._rRadius);
            _this._lLineStart = _this._lLineStart.rotateDegreesAbout(rotDegrees, _this._lCenter);
            _this._lLineInStart = _this._lLineInStart.rotateDegreesAbout(inDegrees, _this._lCenter);
            _this.testLine(_this._lLineStart, _this._lLineInStart, _this._lCenter, _this._lRadius);
            _this._rRayStartVU = _this._rRayStartVU.rotateDegreesAbout(rotDegrees, _this._rCenterVU);
            _this._rRayInStartVU = _this._rRayInStartVU.rotateDegreesAbout(inDegrees, _this._rCenterVU);
            _this._rViewportUp.draw(ctx, 2, "white");
            _this.testRay(_this._rRayStartVU, _this._rRayInStartVU, _this._rCenterVU, _this._rRadiusVU, _this._rViewportUp);
            _this._rRayStartVD = _this._rRayStartVD.rotateDegreesAbout(rotDegrees, _this._rCenterVD);
            _this._rRayInStartVD = _this._rRayInStartVD.rotateDegreesAbout(inDegrees, _this._rCenterVD);
            _this._rViewportDown.draw(ctx, 2, "white");
            _this.testRay(_this._rRayStartVD, _this._rRayInStartVD, _this._rCenterVD, _this._rRadiusVD, _this._rViewportDown);
            _this._lLineStartVU = _this._lLineStartVU.rotateDegreesAbout(rotDegrees, _this._lCenterVU);
            _this._lLineInStartVU = _this._lLineInStartVU.rotateDegreesAbout(inDegrees, _this._lCenterVU);
            _this._lViewportUp.draw(ctx, 2, "white");
            _this.testLine(_this._lLineStartVU, _this._lLineInStartVU, _this._lCenterVU, _this._lRadiusVU, _this._lViewportUp);
            _this._lLineStartVD = _this._lLineStartVD.rotateDegreesAbout(rotDegrees, _this._lCenterVD);
            _this._lLineInStartVD = _this._lLineInStartVD.rotateDegreesAbout(inDegrees, _this._lCenterVD);
            _this._lViewportDown.draw(ctx, 2, "white");
            _this.testLine(_this._lLineStartVD, _this._lLineInStartVD, _this._lCenterVD, _this._lRadiusVD, _this._lViewportDown);
            requestAnimationFrame(_this.animLoop);
        };
        this._ctx = this._canvas.getContext("2d");
        var ss = 150;
        var sx = 10;
        var sy = 10;
        var sw = ss;
        var sh = ss;
        var sd = 10;
        var sy2 = sy + sh + sd;
        var x = sx;
        var y = sy;
        var diameter = ss;
        var radius = diameter / 2;
        this._rCenter = new Vector2D(x + radius, y + radius);
        this._rRadius = radius;
        this._rRayStart = new Vector2D(this._rCenter.x - radius, this._rCenter.y);
        this._rRayInStart = this._rRayStart;
        x = sx;
        y = sy2;
        this._lCenter = new Vector2D(x + radius, y + radius);
        this._lRadius = radius;
        this._lLineStart = new Vector2D(this._lCenter.x - radius, this._lCenter.y);
        this._lLineInStart = this._lLineStart;
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._rCenterVU = new Vector2D(0, 0);
        this._rRadiusVU = radius;
        this._rViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._rRayStartVU = new Vector2D(-radius, 0);
        this._rRayInStartVU = this._rRayStartVU;
        x = sx;
        y = sy2;
        this._rCenterVD = new Vector2D(0, 0);
        this._rRadiusVD = radius;
        this._rViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._rRayStartVD = new Vector2D(-radius, 0);
        this._rRayInStartVD = this._rRayStartVD;
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._lCenterVU = new Vector2D(0, 0);
        this._lRadiusVU = radius;
        this._lViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._lLineStartVU = new Vector2D(-radius, 0);
        this._lLineInStartVU = this._lLineStartVU;
        y = sy2;
        this._lCenterVD = new Vector2D(0, 0);
        this._lRadiusVD = radius;
        this._lViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._lLineStartVD = new Vector2D(-radius, 0);
        this._lLineInStartVD = this._lLineStartVD;
    }
    TestVector.prototype.circleOutline = function (center, radius, viewport) {
        var ctx = this._ctx;
        if (viewport) {
            center = viewport.toScreen(center);
        }
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 1;
        //ctx.setLineDash([5, 0, 5]);
        ctx.arc(center.x, center.y, radius, 0, MathEx.TWO_PI);
        ctx.stroke();
        ctx.restore();
    };
    TestVector.prototype.testRay = function (rayStart, rayInStart, center, radius, viewport) {
        var ctx = this._ctx;
        this.circleOutline(center, radius, viewport);
        var ray = new Ray2D(rayStart, rayStart.directionTo(center), radius * 2);
        var rayIn = new Ray2D(rayInStart, rayInStart.directionTo(center), radius);
        var rayReflect = rayIn.reflectOff(ray);
        var rayNormal = new Ray2D(center, ray.normal, radius);
        ray.draw(ctx, 5, "blue", viewport);
        rayNormal.draw(ctx, 3, "red", viewport);
        rayIn.draw(ctx, 4, "black", viewport);
        rayReflect.draw(ctx, 4, "gray", viewport);
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    };
    TestVector.prototype.testLine = function (lineStart, lineInStart, center, radius, viewport) {
        var ctx = this._ctx;
        this.circleOutline(center, radius, viewport);
        var line = Line2D.fromRay(new Ray2D(lineStart, lineStart.directionTo(center), radius * 2));
        var lineIn = new Line2D(lineInStart, center);
        var lineReflect = line.reflect(lineIn);
        var lineNormal = Line2D.fromRay(new Ray2D(center, line.normal, radius));
        line.draw(ctx, 5, "blue", viewport);
        lineNormal.draw(ctx, 3, "red", viewport);
        lineReflect.draw(ctx, 4, "gray", viewport);
        lineIn.draw(ctx, 4, "black", viewport);
        //console.log(`Origin (${lineReflect.origin.x}, ${lineReflect.origin.y}) - Endpoint (${lineReflect.endPoint.x}, ${lineReflect.endPoint.y})`);
    };
    TestVector.prototype.start = function () {
        requestAnimationFrame(this.animLoop);
    };
    return TestVector;
}());
var handleOnLoad = function () {
    var canvas = document.getElementById("canvas");
    new TestVector(canvas).start();
};
window.addEventListener("load", handleOnLoad);
//# sourceMappingURL=TestVector.js.map