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
var Test = /** @class */ (function () {
    function Test(_canvas) {
        var _this = this;
        this._canvas = _canvas;
        this._rLength = 100;
        this._rLeft = 100;
        this._rNormalLength = 50;
        this._rCenterY = 100;
        this._rLoc = new LocInfo(this._rLeft, this._rCenterY, this._rLeft, this._rCenterY - this._rNormalLength, this._rLeft + this._rLength, this._rCenterY + this._rNormalLength);
        this._lLength = 100;
        this._lLeft = 100;
        this._lNormalLength = 50;
        this._lCenterY = 300;
        this._lLoc = new LocInfo(this._lLeft, this._lCenterY, this._lLeft, this._lCenterY - this._lNormalLength, this._lLeft + this._lLength, this._lCenterY + this._lNormalLength);
        this.animLoop = function () {
            var ctx = _this._ctx;
            ctx.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
            _this.testRay();
            _this.testLine();
            requestAnimationFrame(_this.animLoop);
        };
        this._ctx = this._canvas.getContext("2d");
    }
    Test.prototype.testRay = function () {
        var ctx = this._ctx;
        this._rLoc.advance();
        var lineIn = new Line2D(new Vector2D(this._rLoc.x, this._rLoc.y), this._rayNormal.origin);
        var rayIn = new Ray2D(lineIn.origin, lineIn.direction, lineIn.length);
        var rayReflect = rayIn.reflectOff(this._testRay);
        this._testRay.draw(ctx, 5, "blue");
        this._rayNormal.draw(ctx, 3, "red");
        rayIn.draw(ctx, 4, "black");
        rayReflect.draw(ctx, 4, "gray");
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    };
    Test.prototype.testLine = function () {
        var ctx = this._ctx;
        this._lLoc.advance();
        var lineIn = new Line2D(new Vector2D(this._lLoc.x, this._lLoc.y), this._lineNormal.origin);
        var rayReflect = this._testLine.reflect(lineIn);
        this._testLine.draw(ctx, 5, "blue");
        this._lineNormal.draw(ctx, 3, "red");
        rayReflect.draw(ctx, 4, "gray");
        lineIn.draw(ctx, 4, "black");
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    };
    Test.prototype.start = function () {
        var ray = new Ray2D(new Vector2D(this._rLeft, this._rCenterY), new Vector2D(3, 0), this._rLength);
        //ray = new Ray2D(new Vector2D(this._rLeft, this._rCenterY), new Vector2D(3, 7), this._rLength);
        this._testRay = ray;
        this._rNormal = ray.normal;
        this._rayNormal = new Ray2D(ray.origin, this._rNormal, this._rNormalLength);
        this._rayNormal = new Ray2D(ray.getPointAt(ray.length / 2), this._rNormal, this._rNormalLength);
        var line = new Line2D(new Vector2D(this._lLeft, this._lCenterY), new Vector2D(this._lLeft + this._lLength, this._lCenterY));
        this._testLine = line;
        this._lNormal = line.normal;
        this._lineNormal = new Ray2D(line.origin, this._lNormal, this._lNormalLength);
        this._lineNormal = new Ray2D(line.getPointAt(line.length / 2), this._lNormal, this._lNormalLength);
        requestAnimationFrame(this.animLoop);
    };
    return Test;
}());
var handleOnLoad = function () {
    //console.log("In handleOnLoad");
    var canvas = document.getElementById("canvas");
    new Test(canvas).start();
};
window.addEventListener("load", handleOnLoad);
//console.log("In test.js");
//# sourceMappingURL=Test.js.map