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
            _this.testRay(_this._testRay, _this._rCenter, _this._rRadius, _this._rPolar);
            _this.testLine(_this._testLine, _this._lCenter, _this._lRadius, _this._lPolar);
            _this._rViewportUp.draw(ctx, 2, "white");
            _this.testRay(_this._testRayVU, _this._rCenterVU, _this._rRadiusVU, _this._rPolarVU, _this._rViewportUp);
            _this._rViewportDown.draw(ctx, 2, "white");
            _this.testRay(_this._testRayVD, _this._rCenterVD, _this._rRadiusVD, _this._rPolarVD, _this._rViewportDown);
            _this._lViewportUp.draw(ctx, 2, "white");
            _this.testLine(_this._testLineVU, _this._lCenterVU, _this._lRadiusVU, _this._lPolarVU, _this._lViewportUp);
            _this._lViewportDown.draw(ctx, 2, "white");
            _this.testLine(_this._testLineVD, _this._lCenterVD, _this._lRadiusVD, _this._lPolarVD, _this._lViewportDown);
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
        this._testRay = new Ray2D(new Vector2D(this._rCenter.x - radius, this._rCenter.y), new Vector2D(1, 0), this._rRadius * 2);
        this._rPolar = new Polar(this._rRadius, 0);
        x = sx;
        y = sy2;
        this._lCenter = new Vector2D(x + radius, y + radius);
        this._lRadius = radius;
        this._testLine = new Line2D(new Vector2D(this._lCenter.x - radius, this._lCenter.y), new Vector2D(this._lCenter.x + radius, this._lCenter.y));
        this._lPolar = new Polar(this._lRadius, 0);
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._rCenterVU = new Vector2D(0, 0);
        this._rRadiusVU = radius;
        this._rViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._testRayVU = new Ray2D(new Vector2D(-radius, 0), new Vector2D(1, 0), this._rRadiusVU * 2);
        this._rPolarVU = new Polar(this._rRadiusVU, 0);
        x = sx;
        y = sy2;
        this._rCenterVD = new Vector2D(0, 0);
        this._rRadiusVD = radius;
        this._rViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._testRayVD = new Ray2D(new Vector2D(-radius, 0), new Vector2D(1, 0), this._rRadiusVD * 2);
        this._rPolarVD = new Polar(this._rRadiusVD, 0);
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._lCenterVU = new Vector2D(0, 0);
        this._lRadiusVU = radius;
        this._lViewportUp = new Viewport2D(WorldOrientation.Up, -radius, -radius, diameter, diameter, x, y);
        this._testLineVU = new Line2D(new Vector2D(-radius, 0), new Vector2D(radius, 0));
        this._lPolarVU = new Polar(this._lRadiusVU, 0);
        y = sy2;
        this._lCenterVD = new Vector2D(0, 0);
        this._lRadiusVD = radius;
        this._lViewportDown = new Viewport2D(WorldOrientation.Down, -radius, -radius, diameter, diameter, x, y);
        this._testLineVD = new Line2D(new Vector2D(-radius, 0), new Vector2D(radius, 0));
        this._lPolarVD = new Polar(this._lRadiusVD, 0);
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
    TestVector.prototype.testRay = function (ray, center, radius, polar, viewport) {
        var ctx = this._ctx;
        this.circleOutline(center, radius, viewport);
        polar.add(MathEx.TWO_PI / 360);
        var pVector = polar.vector.clone().add(center);
        var lineIn = new Line2D(pVector, center);
        var rayIn = new Ray2D(lineIn.origin, lineIn.direction, lineIn.length);
        var rayReflect = rayIn.reflectOff(ray);
        var rayNormal = new Ray2D(center, ray.normal, radius);
        ray.draw(ctx, 5, "blue", viewport);
        rayNormal.draw(ctx, 3, "red", viewport);
        rayIn.draw(ctx, 4, "black", viewport);
        rayReflect.draw(ctx, 4, "gray", viewport);
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    };
    TestVector.prototype.testLine = function (line, center, radius, polar, viewport) {
        var ctx = this._ctx;
        this.circleOutline(center, radius, viewport);
        polar.add(MathEx.TWO_PI / 360);
        var pVector = polar.vector.clone().add(center);
        var lineIn = new Line2D(pVector, center);
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