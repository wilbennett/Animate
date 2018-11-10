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
    function Line2D(start, end) {
        var _this = this;
        var direction = Vector2D.subtract(end, start);
        _this = _super.call(this, start, direction, direction.mag) || this;
        return _this;
    }
    Line2D.prototype.draw = function (ctx, width, color, bounds) {
        _super.prototype.drawLine.call(this, ctx, width, color, bounds);
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
    Line2D.prototype.toRay = function () {
        return new Ray2D(this.origin, this.direction, this.length);
    };
    Line2D.fromRay = function (ray) {
        return new Line2D(ray.origin, ray.endPoint);
    };
    return Line2D;
}(Ray2D));
//# sourceMappingURL=Line2D.js.map