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
    function Ball(_radius, _color, position, velocity, mass, _boundary, completeCallback, restitution) {
        var _this = _super.call(this, position, velocity, mass) || this;
        _this._radius = _radius;
        _this._color = _color;
        _this._boundary = _boundary;
        _this.completeCallback = completeCallback;
        _this._opacity = 1;
        _this._allowBounce = true;
        _this.priorUp = false;
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
        _this.priorPreV = 0;
        if (!restitution)
            restitution = 0.98;
        _this.restitutionCoefficient = restitution;
        _this._width = _this._radius * 2;
        _this._height = _this._width;
        _this._maxRotateVelocity = MathEx.toRadians(90);
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
    Ball.prototype.createBounds = function () { return this.createBoundsFromRadius(this.radius); };
    Ball.prototype.adjustRotateAcceleration = function () {
        this.applyRotateForce(this.acceleration.x * 10);
        _super.prototype.adjustRotateAcceleration.call(this);
    };
    Ball.prototype.update = function (frame, now, elapsedTime, timeScale, world) {
        var origY = this.position.y;
        _super.prototype.update.call(this, frame, now, elapsedTime, timeScale, world);
        if (!this._allowBounce) {
            this.position = this.position.withY(origY);
            this._velocity = this.velocity.withY(0);
            if (this._opacity > 0.2)
                this._opacity = Math.max(this._opacity - 0.01, 0);
            if (this._opacity <= 0.2)
                this.completeCallback(this);
        }
        this.checkBoundary(world.gravity);
    };
    //*
    Ball.prototype.draw = function (viewport, frame) {
        _super.prototype.draw.call(this, viewport, frame);
        var ctx = viewport.ctx;
        var ballStrokeColor = "#bbbbbb";
        var ballStrokeWidth = 1;
        /*
        let isUp = this._boundary.isUp(this.velocity.y);
        let isDown = this._boundary.isDown(this.velocity.y);
        let highColor = "black";

        if (this.priorUp && isDown) {
            this.highY = this.priorY;
        }

        if (this._boundary.isAbove(this.position.y, this.highY)) {
            this.highY = this.position.y;
            highColor = "white";
        }

        //if (this.velocity.mag > this.priorVelocity.mag) {
        if (this.velocity.withY(0).mag > this.priorVelocity.withY(0).mag) {
            ballStrokeColor = "yellow";
            ballStrokeWidth = 4;
        }

        this.priorY = this.position.y;
        this.priorUp = isUp;
        //*/
        var radiusX = this.radius;
        var radiusY = this.radius;
        var highlightPos = Vector2D.fromRadians(this.rotateRadians).mult(this.radius);
        highlightPos = highlightPos.add(this.position);
        var gradient = ctx.createRadialGradient(highlightPos.x, highlightPos.y, this.radius * 0.01, highlightPos.x, highlightPos.y, this.radius);
        gradient.addColorStop(0, "#bbbbbb");
        gradient.addColorStop(0.7, this._color);
        ctx.save();
        ctx.globalAlpha = this._opacity;
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.globalAlpha = ctx.globalAlpha * 0.7;
        ctx.strokeStyle = ballStrokeColor;
        ctx.lineWidth = ballStrokeWidth;
        ctx.ellipse(this.position.x, this.position.y, radiusX * 0.95, radiusY * 0.95, 0, 1 + 0, MathEx.TWO_PI - 0.5);
        ctx.stroke();
        ctx.closePath();
        /*
        ctx.beginPath();
        ctx.strokeStyle = highColor;
        ctx.lineWidth = 2;
        let y = this._boundary.offsetAbove(this.highY, this.radius);
        ctx.moveTo(this.position.x - this.radius * 2, y);
        ctx.lineTo(this.position.x + this.radius * 2, y);
        ctx.stroke();
        //*/
        ctx.restore();
        //if (frame % 60 === 0)
        //    console.log("acceleration: " + this.acceleration
        //        + ", rotate acceleration: " + MathEx.toDegrees(this.rotateAcceleration).toFixed(2)
        //        + ", rotate velocity: " + MathEx.toDegrees(this.rotateVelocity).toFixed(2))
    };
    Ball.prototype.checkBoundary = function (gravity) {
        var boundary = this._boundary;
        var reflectVelocity = null;
        var priorVelocity = this.priorVelocity;
        var leftPenetration = boundary.leftPenetration(this.position.x - this.radius);
        var topPenetration = boundary.topPenetration(boundary.offsetAbove(this.position.y, this.radius));
        var rightPenetration = boundary.rightPenetration(this.position.x + this.radius);
        var bottomPenetration = boundary.bottomPenetration(boundary.offsetBelow(this.position.y, this.radius));
        // TODO: Reflecting with prior velocity.  Need to get the velocity at time of impact.
        if (leftPenetration > 0) {
            this.position = this.position.withX(boundary.leftOffset(this.radius));
            reflectVelocity = boundary.reflectLeft(priorVelocity);
            reflectVelocity = reflectVelocity.withX(reflectVelocity.x * this.restitutionCoefficient);
        }
        else if (rightPenetration > 0) {
            this.position = this.position.withX(boundary.rightOffset(this.radius));
            reflectVelocity = boundary.reflectRight(priorVelocity);
            reflectVelocity = reflectVelocity.withX(reflectVelocity.x * this.restitutionCoefficient);
        }
        if (reflectVelocity)
            priorVelocity = reflectVelocity;
        if (topPenetration > 0) {
            this.position = this.position.withY(boundary.topOffsetBelow(this.radius));
            reflectVelocity = boundary.reflectTop(priorVelocity);
            reflectVelocity = reflectVelocity.withY(reflectVelocity.y * this.restitutionCoefficient);
        }
        else if (bottomPenetration > 0) {
            var preV = this.velocity.mag;
            //if (preV > this.priorPreV) console.log("####################################################");
            this.priorPreV = preV;
            this.position = this.position.withY(boundary.bottomOffsetAbove(this.radius));
            reflectVelocity = boundary.reflectBottom(priorVelocity);
            reflectVelocity = reflectVelocity.withY(reflectVelocity.y * this.restitutionCoefficient);
            var postV = reflectVelocity.mag;
            //console.log("Pre bounce: " + preV.toFixed(2) + ", post bounce: " + postV.toFixed(2) + " " + reflectVelocity + ", " + (preV - postV).toFixed(2));
            if (Math.abs(reflectVelocity.y) < 0.01) {
                reflectVelocity = reflectVelocity.withY(0);
                this._allowBounce = false;
            }
        }
        if (reflectVelocity)
            this._velocity = reflectVelocity;
    };
    return Ball;
}(Character2D));
//# sourceMappingURL=Ball.js.map