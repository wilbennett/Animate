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
var Wind = /** @class */ (function (_super) {
    __extends(Wind, _super);
    function Wind(speed, degrees, position, _radius) {
        var _this = _super.call(this, position, Vector2D.fromDegrees(degrees).mult(speed), 0) || this;
        _this._radius = _radius;
        _this._density = 1.229;
        _this._decayRate = 0.01;
        _this._minValue = 1.1;
        _this._radiusPct = 0.10;
        _this._width = _this._radius * 2;
        _this._height = _this._width;
        _this.createBoundary();
        return _this;
    }
    Object.defineProperty(Wind.prototype, "density", {
        get: function () { return this._density; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wind.prototype, "degrees", {
        get: function () { return this.velocity.degrees; },
        set: function (value) { this._velocity = Vector2D.fromDegrees(value).mult(this.velocity.mag); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wind.prototype, "radians", {
        get: function () { return this.velocity.radians; },
        set: function (value) { this._velocity = Vector2D.fromRadians(value).mult(this.velocity.mag); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wind.prototype, "speed", {
        get: function () { return this.velocity.mag; },
        set: function (value) {
            this._velocity = this.velocity.normalizeMult(value);
            this.createBoundary();
        },
        enumerable: true,
        configurable: true
    });
    Wind.prototype.createBounds = function () { return this.createBoundsFromRadius(this._radius); };
    Wind.prototype.intersectsWithPoint = function (point) {
        return this._baseLine.pointSide(point) === this._positionSide
            && this._rightLine.pointSide(point) === this._positionSide
            && this._frontLine.pointSide(point) === this._positionSide
            && this._leftLine.pointSide(point) === this._positionSide;
    };
    Wind.prototype.intersectsWithCharacter = function (character) {
        var bounds = character.bounds;
        // NOTE: Does not consider where the edges overlap but no corner is inside.
        return this.intersectsWithPoint(bounds.topLeft)
            || this.intersectsWithPoint(bounds.bottomLeft)
            || this.intersectsWithPoint(bounds.bottomRight)
            || this.intersectsWithPoint(bounds.topRight);
    };
    Wind.prototype.calculateForce = function () { };
    Wind.prototype.calculateForceForCharacter = function (character) {
        var charRay = new Ray2D(character.position, this.position);
        var velocity = this.velocity.decay(this._decayRate, charRay.length);
        var area = 1; // TODO: Calculate proper impact area.
        var force = Physics.calcWindForce(this.density, area, velocity);
        return force;
    };
    Wind.prototype.update = function (frame, now, elapsedTime, timeScale, world) {
        //super.update(frame, now, elapsedTime, timeScale, world);
        this._radiusPct = (this._radiusPct + 0.01) % 0.9 + 0.10;
    };
    Wind.prototype.createBoundary = function () {
        this._oppositeVelocityDir = this.velocity.normalizeMult(-1);
        var position = this.position.add(this._oppositeVelocityDir);
        var distToTarget = Math.abs(MathEx.calcDecayTime(this.speed, this._decayRate, this._minValue));
        var radiusVector = this.velocity.normalizeMult(this._radius);
        var baseStart = radiusVector.rotateDegrees(90).add(position);
        var baseEnd = radiusVector.rotateDegrees(-90).add(position);
        this._baseLine = new Ray2D(baseStart, baseEnd);
        this._rightLine = new Ray2D(baseEnd, this.velocity, distToTarget);
        this._frontLine = new Ray2D(this._rightLine.endPoint, this._baseLine.direction.mult(-1), this._baseLine.length);
        this._leftLine = new Ray2D(this._frontLine.endPoint, this._oppositeVelocityDir, distToTarget);
        this._positionSide = this._baseLine.pointSide(this.position);
    };
    Wind.prototype.draw = function (viewport, frame) {
        _super.prototype.draw.call(this, viewport, frame);
        var ctx = viewport.ctx;
        var origAlpha = ctx.globalAlpha;
        var startRadians = MathEx.toRadians(this.velocity.degrees - 90);
        var endRadians = MathEx.toRadians(this.velocity.degrees + 90);
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, 10, 10, 0, startRadians, endRadians);
        ctx.fillStyle = "purple";
        ctx.fill();
        ctx.closePath();
        var v = this._velocity.normalizeMult(this._radius * 0.5);
        v = v.add(this.position);
        ctx.beginPath();
        ctx.strokeStyle = "purple";
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.globalAlpha = 0.6;
        ctx.globalAlpha = this._radiusPct;
        var radiusX = this._radius * this._radiusPct;
        var radiusY = radiusX;
        ctx.ellipse(this.position.x, this.position.y, radiusX, radiusY, 0, startRadians, endRadians);
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = origAlpha;
        /*
        this._baseLine.draw(ctx, 2, "white");
        this._leftLine.draw(ctx, 2, "black");
        this._rightLine.draw(ctx, 2, "green");
        this._frontLine.draw(ctx, 2, "purple");
        //*/
        /*
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.velocity.radians);
        ctx.translate(-this.position.x, -this.position.y);
        //ctx.translate(0, this.position.y + (this.world.screenHeight - 1) / 3);
        //ctx.scale(1, -1);
        ctx.font = "12px Arial";
        let dist = 0;
        let pos = this.world.offsetAbove(this.position.y, dist + 15);
        let speed = this.speed;

        while (speed > this._minValue) {
            speed = MathEx.calcDecay(this.speed, this._decayRate, dist);
            ctx.fillText(speed.toFixed(2), this.position.x + 15, pos);
            dist += 15;
            pos = this.world.offsetAbove(this.position.y, dist + 15);
        }
        ctx.restore();
        //*/
        /*
        this.world.characters.forEach(character => {
            if (this.intersectsWithCharacter(character)) {
                let charRay = new Ray2D(character.position, this.position);
                charRay.draw(ctx, 1, "yellow");
            }
        }, this);
        //*/
    };
    return Wind;
}(Character2D));
//# sourceMappingURL=Wind.js.map