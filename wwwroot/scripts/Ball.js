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
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(_radius, _color, position, velocity, acceleration, mass, maxVelocity, _gravityConst, _boundary, completeCallback) {
        var _this = _super.call(this, position, velocity, acceleration, mass, maxVelocity) || this;
        _this._radius = _radius;
        _this._color = _color;
        _this._gravityConst = _gravityConst;
        _this._boundary = _boundary;
        _this.completeCallback = completeCallback;
        _this._opacity = 1;
        _this._allowBounce = true;
        _this._maxRotateVelocity = 0.1;
        return _this;
    }
    Object.defineProperty(Ball.prototype, "radius", {
        get: function () { return this._radius; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "color", {
        get: function () { return this._color; },
        enumerable: true,
        configurable: true
    });
    Ball.prototype.updateRotateVelocity = function (frame, timestamp, delta) {
        //this._rotateAcceleration = this._acceleration.x / 10;
        this.applyRotateForce(this._acceleration.x / 5);
        _super.prototype.updateRotateVelocity.call(this, frame, timestamp, delta);
    };
    Ball.prototype.update = function (frame, timestamp, delta, characters) {
        var origY = this._position.y;
        _super.prototype.update.call(this, frame, timestamp, delta, characters);
        if (!this._allowBounce) {
            this.position = this.position.withY(origY);
            this.velocity = this.velocity.withY(0);
            if (this._opacity > 0.2)
                this._opacity = Math.max(this._opacity - 0.01, 0);
            if (this._opacity <= 0.2)
                this.completeCallback(this);
        }
        this.checkBoundary();
    };
    //*
    Ball.prototype.draw = function (ctx, frame) {
        _super.prototype.draw.call(this, ctx, frame);
        var radiusX = this._radius;
        var radiusY = this._radius;
        ctx.save();
        var polar = new Polar2D(this._radius, this._rotateRadians);
        var highlightPos = polar.vector;
        highlightPos = highlightPos.add(this.position);
        var gradient = ctx.createRadialGradient(highlightPos.x, highlightPos.y, this._radius * 0.01, highlightPos.x, highlightPos.y, this._radius);
        gradient.addColorStop(0, "#bbbbbb");
        gradient.addColorStop(0.7, this._color);
        ctx.globalAlpha = this._opacity;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.globalAlpha = ctx.globalAlpha * 0.7;
        ctx.strokeStyle = "#bbbbbb";
        ctx.ellipse(this.position.x, this.position.y, radiusX * 0.95, radiusY * 0.95, 0, 1 + 0, MathEx.TWO_PI - 0.5);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };
    /*/
    draw(ctx: CanvasRenderingContext2D, frame: number) {
        super.draw(ctx, frame);

        let radiusX = this._radius;
        let radiusY = this._radius;

        ctx.save();

        ctx.translate(this._position.x, this._position.y);
        ctx.rotate(this._rotateRadians);
        ctx.translate(-this._position.x, -this._position.y);

        let gradient = ctx.createRadialGradient(this.position.x + radiusX, this.position.y, radiusX * 0.01, this.position.x + radiusX, this.position.y, radiusX);
        gradient.addColorStop(0, "#bbbbbb");
        gradient.addColorStop(0.7, this._color);

        ctx.globalAlpha = this._opacity;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = ctx.globalAlpha * 0.7;
        ctx.strokeStyle = "#bbbbbb";
        ctx.ellipse(this.position.x, this.position.y, radiusX * 0.95, radiusY * 0.95, 0, 1 + 0, MathEx.TWO_PI - 0.5);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    //*/
    Ball.prototype.checkBoundary = function () {
        var boundary = this._boundary;
        var leftPenetration = boundary.leftPenetration(this.position.x - this.radius);
        var topPenetration = boundary.topPenetration(boundary.offsetAbove(this.position.y, this.radius));
        var rightPenetration = boundary.rightPenetration(this.position.x + this.radius);
        var bottomPenetration = boundary.bottomPenetration(boundary.offsetBelow(this.position.y, this.radius));
        if (leftPenetration > 0 && this.velocity.x < 0) {
            this.velocity = this.velocity.withX(this.velocity.x * -1);
            this.position = this.position.withX(boundary.leftOffset(this.radius));
        }
        if (rightPenetration > 0 && this.velocity.x > 0) {
            this.velocity = this.velocity.withX(this.velocity.x * -1);
            this.position = this.position.withX(boundary.rightOffset(this.radius));
        }
        if (topPenetration > 0 && boundary.isUp(this.velocity.y)) {
            this.velocity = this.velocity.withY(this.velocity.y * -1);
            this.position = this.position.withY(boundary.topOffsetBelow(this.radius));
        }
        if (bottomPenetration > 0 && boundary.isDown(this.velocity.y)) {
            this.velocity = this.velocity.withY(this.velocity.y * -1);
            this.position = this.position.withY(boundary.bottomOffsetAbove(this.radius));
            var force = Math.abs(this.velocity.y); // TODO: Calculate proper force.
            if (force <= Math.abs(this._gravityConst)) {
                this.velocity = this.velocity.withY(0);
                this._allowBounce = false;
            }
        }
    };
    return Ball;
}(Character));
//# sourceMappingURL=Ball.js.map