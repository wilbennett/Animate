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
            var vColor = "white";
            var rColor = "blue";
            var rColor2 = "purple";
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
            _this._rViewportUp.draw(ctx, 2, vColor);
            _this.testRay(_this._rRayStartVU, _this._rRayInStartVU, _this._rCenterVU, _this._rRadiusVU, _this._rViewportUp);
            _this._rRayStartVD = _this._rRayStartVD.rotateDegreesAbout(rotDegrees, _this._rCenterVD);
            _this._rRayInStartVD = _this._rRayInStartVD.rotateDegreesAbout(inDegrees, _this._rCenterVD);
            _this._rViewportDown.draw(ctx, 2, vColor);
            _this.testRay(_this._rRayStartVD, _this._rRayInStartVD, _this._rCenterVD, _this._rRadiusVD, _this._rViewportDown);
            _this._lLineStartVU = _this._lLineStartVU.rotateDegreesAbout(rotDegrees, _this._lCenterVU);
            _this._lLineInStartVU = _this._lLineInStartVU.rotateDegreesAbout(inDegrees, _this._lCenterVU);
            _this._lViewportUp.draw(ctx, 2, vColor);
            _this.testLine(_this._lLineStartVU, _this._lLineInStartVU, _this._lCenterVU, _this._lRadiusVU, _this._lViewportUp);
            _this._lLineStartVD = _this._lLineStartVD.rotateDegreesAbout(rotDegrees, _this._lCenterVD);
            _this._lLineInStartVD = _this._lLineInStartVD.rotateDegreesAbout(inDegrees, _this._lCenterVD);
            _this._lViewportDown.draw(ctx, 2, vColor);
            _this.testLine(_this._lLineStartVD, _this._lLineInStartVD, _this._lCenterVD, _this._lRadiusVD, _this._lViewportDown);
            _this._rRayR = _this._rRayR.rotateDegrees(rotDegrees);
            _this._rRayR2 = _this._rRayR2.rotateDegrees(inDegrees);
            _this.circleOutline(_this._rRayR.origin, _this._rRayR.length);
            _this._rRayR.draw(ctx, 2, rColor);
            _this._rRayR2.draw(ctx, 2, rColor2);
            var vector = _this.getRayEndpointVector(_this._rRayR);
            vector.draw(ctx, 3, "green");
            _this.drawAngleText(_this._rRayR, _this._rRayR2, _this._rRayR.origin);
            _this._lLineR = _this._lLineR.rotateDegrees(rotDegrees);
            _this._lLineR2 = _this._lLineR2.rotateDegrees(inDegrees);
            _this.circleOutline(_this._lLineR.origin, _this._lLineR.length);
            _this._lLineR.draw(ctx, 2, rColor);
            _this._lLineR2.draw(ctx, 2, rColor2);
            _this.drawAngleText(_this._lLineR, _this._lLineR2, _this._lLineR.origin);
            _this._rRayRVU = _this._rRayRVU.rotateDegrees(rotDegrees);
            _this._rRayRVU2 = _this._rRayRVU2.rotateDegrees(inDegrees);
            _this.circleOutline(_this._rRayRVU.origin, _this._rRayRVU.length, _this._rViewportRUp);
            _this._rViewportRUp.draw(ctx, 2, vColor);
            _this._rRayRVU.draw(ctx, 2, rColor, _this._rViewportRUp);
            _this._rRayRVU2.draw(ctx, 2, rColor2, _this._rViewportRUp);
            vector = _this.getRayEndpointVector(_this._rRayRVU, _this._rViewportRUp);
            vector.draw(ctx, 3, "green");
            _this.drawAngleText(_this._rRayRVU, _this._rRayRVU2, _this._rRayRVU.origin, _this._rViewportRUp);
            _this._rRayRVD = _this._rRayRVD.rotateDegrees(rotDegrees);
            _this._rRayRVD2 = _this._rRayRVD2.rotateDegrees(inDegrees);
            _this.circleOutline(_this._rRayRVD.origin, _this._rRayRVD.length, _this._rViewportRDown);
            _this._rViewportRDown.draw(ctx, 2, vColor);
            _this._rRayRVD.draw(ctx, 2, rColor, _this._rViewportRDown);
            _this._rRayRVD2.draw(ctx, 2, rColor2, _this._rViewportRDown);
            _this.drawAngleText(_this._rRayRVD, _this._rRayRVD2, _this._rRayRVD.origin, _this._rViewportRDown);
            _this._lLineRVU = _this._lLineRVU.rotateDegrees(rotDegrees);
            _this._lLineRVU2 = _this._lLineRVU2.rotateDegrees(inDegrees);
            _this.circleOutline(_this._lLineRVU.origin, _this._lLineRVU.length, _this._lViewportRUp);
            _this._lViewportRUp.draw(ctx, 2, vColor);
            _this._lLineRVU.draw(ctx, 2, rColor, _this._lViewportRUp);
            _this._lLineRVU2.draw(ctx, 2, rColor2, _this._lViewportRUp);
            _this.drawAngleText(_this._lLineRVU, _this._lLineRVU2, _this._lLineRVU.origin, _this._lViewportRUp);
            _this._lLineRVD = _this._lLineRVD.rotateDegrees(rotDegrees);
            _this._lLineRVD2 = _this._lLineRVD2.rotateDegrees(inDegrees);
            _this.circleOutline(_this._lLineRVD.origin, _this._lLineRVD.length, _this._lViewportRDown);
            _this._lViewportRDown.draw(ctx, 2, vColor);
            _this._lLineRVD.draw(ctx, 2, rColor, _this._lViewportRDown);
            _this._lLineRVD2.draw(ctx, 2, rColor2, _this._lViewportRDown);
            _this.drawAngleText(_this._lLineRVD, _this._lLineRVD2, _this._lLineRVD.origin, _this._lViewportRDown);
            _this._rRayRA = _this._rRayRA.rotateDegreesAbout(rotDegrees, _this._rCenterRA);
            _this.circleOutline(_this._rCenterRA, _this._rRadiusRA);
            _this._rRayRA.draw(ctx, 2, rColor);
            _this.drawIntersection(_this._rRayRA2, _this._rRayRA);
            _this._lLineRA = _this._lLineRA.rotateDegreesAbout(rotDegrees, _this._lCenterRA);
            _this.circleOutline(_this._lCenterRA, _this._lRadiusRA);
            _this._lLineRA.draw(ctx, 2, rColor);
            _this.drawIntersection(_this._lLineRA2, _this._lLineRA);
            _this._rRayRAU = _this._rRayRAU.rotateDegreesAbout(rotDegrees, _this._rCenterRAU);
            _this.circleOutline(_this._rCenterRAU, _this._rRadiusRAU, _this._rViewportRAUp);
            _this._rViewportRAUp.draw(ctx, 2, vColor);
            _this._rRayRAU.draw(ctx, 2, rColor, _this._rViewportRAUp);
            _this.drawIntersection(_this._rRayRAU2, _this._rRayRAU, _this._rViewportRAUp);
            _this._rRayRAD = _this._rRayRAD.rotateDegreesAbout(rotDegrees, _this._rCenterRAU);
            _this.circleOutline(_this._rCenterRAD, _this._rRadiusRAD, _this._rViewportRADown);
            _this._rViewportRADown.draw(ctx, 2, vColor);
            _this._rRayRAD.draw(ctx, 2, rColor, _this._rViewportRADown);
            _this.drawIntersection(_this._rRayRAD2, _this._rRayRAD, _this._rViewportRADown);
            _this._lLineRAU = _this._lLineRAU.rotateDegreesAbout(rotDegrees, _this._lCenterRAU);
            _this.circleOutline(_this._lCenterRAU, _this._lRadiusRAU, _this._lViewportRAUp);
            _this._lViewportRAUp.draw(ctx, 2, vColor);
            _this._lLineRAU.draw(ctx, 2, rColor, _this._lViewportRAUp);
            _this.drawIntersection(_this._lLineRAU2, _this._lLineRAU, _this._lViewportRAUp);
            _this._lLineRAD = _this._lLineRAD.rotateDegreesAbout(rotDegrees, _this._lCenterRAU);
            _this.circleOutline(_this._lCenterRAD, _this._lRadiusRAD, _this._lViewportRADown);
            _this._lViewportRADown.draw(ctx, 2, vColor);
            _this._lLineRAD.draw(ctx, 2, rColor, _this._lViewportRADown);
            _this.drawIntersection(_this._lLineRAD2, _this._lLineRAD, _this._lViewportRADown);
            requestAnimationFrame(_this.animLoop);
        };
        this._ctx = this._canvas.getContext("2d");
        var box = new TestBox(10, 10, 100, 100, 10);
        var center0 = Vector2D.emptyVector;
        this._rCenter = box.center;
        this._rRadius = box.radius;
        this._rRayStart = new Vector2D(this._rCenter.x - box.radius, this._rCenter.y);
        this._rRayInStart = this._rRayStart;
        box.moveDown();
        this._lCenter = box.center;
        this._lRadius = box.radius;
        this._lLineStart = new Vector2D(this._lCenter.x - box.radius, this._lCenter.y);
        this._lLineInStart = this._lLineStart;
        box.moveUpRight();
        this._rCenterVU = center0;
        this._rRadiusVU = box.radius;
        this._rViewportUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayStartVU = new Vector2D(-box.radius, 0);
        this._rRayInStartVU = this._rRayStartVU;
        box.moveDown();
        this._rCenterVD = center0;
        this._rRadiusVD = box.radius;
        this._rViewportDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayStartVD = new Vector2D(-box.radius, 0);
        this._rRayInStartVD = this._rRayStartVD;
        box.moveUpRight();
        this._lCenterVU = center0;
        this._lRadiusVU = box.radius;
        this._lViewportUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineStartVU = new Vector2D(-box.radius, 0);
        this._lLineInStartVU = this._lLineStartVU;
        box.moveDown();
        this._lCenterVD = center0;
        this._lRadiusVD = box.radius;
        this._lViewportDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineStartVD = new Vector2D(-box.radius, 0);
        this._lLineInStartVD = this._lLineStartVD;
        box.moveUpRight();
        this._rRayR = new Ray2D(box.center, new Vector2D(1, 0), box.radius);
        this._rRayR2 = this._rRayR;
        box.moveDown();
        this._lLineR = Line2D.fromDirection(box.center, new Vector2D(1, 0), box.radius);
        this._lLineR2 = this._lLineR;
        box.moveUpRight();
        this._rViewportRUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayRVU = new Ray2D(center0, new Vector2D(1, 0), box.radius);
        this._rRayRVU2 = this._rRayRVU;
        box.moveDown();
        this._rViewportRDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rRayRVD = new Ray2D(center0, new Vector2D(1, 0), box.radius);
        this._rRayRVD2 = this._rRayRVD;
        box.moveUpRight();
        this._lViewportRUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineRVU = Line2D.fromDirection(center0, new Vector2D(1, 0), box.radius);
        this._lLineRVU2 = this._lLineRVU;
        box.moveDown();
        this._lViewportRDown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lLineRVD = Line2D.fromDirection(center0, new Vector2D(1, 0), box.radius);
        this._lLineRVD2 = this._lLineRVD;
        box.reset();
        box.moveDown();
        box.moveDown();
        this._rCenterRA = box.center;
        this._rRadiusRA = box.radius;
        this._rRayRA = Ray2D.fromPoints(new Vector2D(box.x, this._rCenterRA.y), new Vector2D(this._rCenterRA.x, box.y + box.h));
        this._rRayRA2 = Ray2D.fromPoints(new Vector2D(box.x + 5, this._rCenterRA.y), new Vector2D(this._rCenterRA.x, this._rCenterRA.y));
        box.moveDown();
        this._lCenterRA = box.center;
        this._lRadiusRA = box.radius;
        this._lLineRA = new Line2D(new Vector2D(box.x, this._lCenterRA.y), new Vector2D(this._lCenterRA.x, box.y + box.h));
        this._lLineRA2 = new Line2D(new Vector2D(box.x + 5, this._lCenterRA.y), new Vector2D(this._lCenterRA.x, this._lCenterRA.y));
        box.moveUpRight();
        this._rViewportRAUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rCenterRAU = center0;
        this._rRadiusRAU = box.radius;
        this._rRayRAU = Ray2D.fromPoints(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._rRayRAU2 = Ray2D.fromPoints(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));
        box.moveDown();
        this._rViewportRADown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._rCenterRAD = center0;
        this._rRadiusRAD = box.radius;
        this._rRayRAD = Ray2D.fromPoints(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._rRayRAD2 = Ray2D.fromPoints(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));
        box.moveUpRight();
        this._lViewportRAUp = new Viewport2D(this._ctx, WorldOrientation.Up, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lCenterRAU = center0;
        this._lRadiusRAU = box.radius;
        this._lLineRAU = new Line2D(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._lLineRAU2 = new Line2D(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));
        box.moveDown();
        this._lViewportRADown = new Viewport2D(this._ctx, WorldOrientation.Down, -box.radius, -box.radius, box.w, box.h, box.x, box.y);
        this._lCenterRAD = center0;
        this._lRadiusRAD = box.radius;
        this._lLineRAD = new Line2D(new Vector2D(-box.radius, center0.y), new Vector2D(center0.x, box.radius));
        this._lLineRAD2 = new Line2D(new Vector2D(-box.radius + 5, center0.y), new Vector2D(center0.x, center0.y));
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
    TestVector.prototype.drawAngleText = function (source, target, center, viewport, mod90) {
        if (mod90 === void 0) { mod90 = false; }
        var ctx = this._ctx;
        if (viewport)
            center = viewport.toScreen(center);
        var degreesBetween = source.degreesBetween(target);
        if (mod90)
            degreesBetween %= 90;
        ctx.font = "20px arial";
        ctx.textAlign = "center";
        ctx.fillText(degreesBetween.toFixed(0), center.x, center.y);
    };
    TestVector.prototype.drawIntersection = function (source, target, viewport) {
        var ctx = this._ctx;
        source.draw(ctx, 2, "purple", viewport);
        var vector = source.getInstersection(target);
        if (!vector)
            return;
        if (viewport)
            vector = viewport.toScreen(vector);
        vector.draw(ctx, 4, "green");
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
        this.drawAngleText(rayIn, ray, center, viewport);
        //console.log(`Origin (${rayReflect.origin.x}, ${rayReflect.origin.y}) - Endpoint (${rayReflect.endPoint.x}, ${rayReflect.endPoint.y})`);
    };
    TestVector.prototype.testLine = function (lineStart, lineInStart, center, radius, viewport) {
        var ctx = this._ctx;
        this.circleOutline(center, radius, viewport);
        var line = Line2D.fromDirection(lineStart, lineStart.directionTo(center), radius * 2);
        var lineIn = new Line2D(lineInStart, center);
        var lineReflect = line.reflect(lineIn);
        var lineNormal = Line2D.fromDirection(center, line.normal, radius);
        line.draw(ctx, 5, "blue", viewport);
        lineNormal.draw(ctx, 3, "red", viewport);
        lineReflect.draw(ctx, 4, "gray", viewport);
        lineIn.draw(ctx, 4, "black", viewport);
        this.drawAngleText(lineIn, line, center, viewport);
        //console.log(`Origin (${lineReflect.origin.x}, ${lineReflect.origin.y}) - Endpoint (${lineReflect.endPoint.x}, ${lineReflect.endPoint.y})`);
    };
    TestVector.prototype.getRayEndpointVector = function (ray, viewport) {
        var vector = Vector2D.fromDegrees(ray.direction.degrees).normalize();
        vector = vector.mult(ray.length).add(ray.origin);
        if (viewport)
            vector = viewport.toScreen(vector);
        return vector;
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