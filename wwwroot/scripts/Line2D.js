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
var Line2D = /** @class */ (function (_super) {
    __extends(Line2D, _super);
    function Line2D(origin, direction, length) {
        var _this = this;
        if (origin instanceof Ray2D) {
            var ray = origin;
            _this = _super.call(this, ray.origin, ray.direction, ray.length) || this;
        }
        else if (length && direction) {
            _this = _super.call(this, origin, direction, length) || this;
        }
        else if (direction) {
            var end = direction;
            _this = _super.call(this, origin, end) || this;
        }
        return _this;
    }
    Line2D.prototype.rotateRadians = function (angle) {
        return new Line2D(this.origin, this.endPoint.rotateRadiansAbout(angle, this.origin));
    };
    Line2D.prototype.rotateDegrees = function (angle) {
        return this.rotateRadians(MathEx.toRadians(angle));
    };
    Line2D.prototype.rotateRadiansAbout = function (angle, center) {
        return new Line2D(this.origin.rotateRadiansAbout(angle, center), this.endPoint.rotateRadiansAbout(angle, center));
    };
    Line2D.prototype.rotateDegreesAbout = function (angle, center) {
        return this.rotateRadiansAbout(MathEx.toRadians(angle), center);
    };
    Line2D.prototype.reflectViaNormal = function (normal) {
        var ray = _super.prototype.reflectViaNormal.call(this, normal);
        return new Line2D(this.endPoint, ray.endPoint);
    };
    Line2D.prototype.reflectOff = function (reflector) {
        return this.reflectViaNormal(reflector.normal);
    };
    Line2D.prototype.reflect = function (source) {
        return source.reflectViaNormal(this.normal);
    };
    Line2D.prototype.toRay = function () { return new Ray2D(this.origin, this.direction, this.length); };
    Line2D.prototype.draw = function (ctx, width, color, bounds) {
        _super.prototype.drawLine.call(this, ctx, width, color, bounds);
    };
    return Line2D;
}(Ray2D));
//# sourceMappingURL=Line2D.js.map