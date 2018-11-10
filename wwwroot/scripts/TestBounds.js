"use strict";
var TestBall = /** @class */ (function () {
    function TestBall(_position, _velocity, _radius, _color, _boundary) {
        this._position = _position;
        this._velocity = _velocity;
        this._radius = _radius;
        this._color = _color;
        this._boundary = _boundary;
    }
    TestBall.prototype.update = function () {
        this._position = this._position.add(this._velocity);
        this.checkBoundary();
    };
    TestBall.prototype.draw = function (ctx, bounds) {
        var position = this._position;
        var radiusX = this._radius;
        var radiusY = this._radius;
        if (bounds) {
            position = bounds.toScreen(position);
            radiusX = radiusX * bounds.boundsToScreenScaleX;
            radiusY = radiusY * bounds.boundsToScreenScaleY;
        }
        ctx.beginPath();
        //ctx.arc(position.x, position.y, this._radius, 0, MathEx.TWO_PI, true);
        ctx.ellipse(position.x, position.y, radiusX, radiusY, 0, 0, MathEx.TWO_PI);
        ctx.fillStyle = this._color;
        ctx.fill();
        ctx.strokeStyle = this._color;
        ctx.stroke();
    };
    TestBall.prototype.checkBoundary = function () {
        var boundary = this._boundary;
        this._position = this._position.add(this._velocity);
        var leftPenetration = boundary.leftPenetration(this._position.x - this._radius);
        var topPenetration = boundary.topPenetration(boundary.offsetAbove(this._position.y, this._radius));
        var rightPenetration = boundary.rightPenetration(this._position.x + this._radius);
        var bottomPenetration = boundary.bottomPenetration(boundary.offsetBelow(this._position.y, this._radius));
        if (leftPenetration > 0) {
            //this._velocity.x *= -1;
            this._position.x = boundary.leftOffset(this._radius);
            this._velocity = boundary.reflectLeft(this._velocity);
        }
        if (rightPenetration > 0) {
            //this._velocity.x *= -1;
            this._position.x = boundary.rightOffset(this._radius);
            this._velocity = boundary.reflectRight(this._velocity);
        }
        if (topPenetration > 0) {
            //this._velocity.y *= -1;
            this._position.y = boundary.topOffsetBelow(this._radius);
            this._velocity = boundary.reflectTop(this._velocity);
        }
        if (bottomPenetration > 0) {
            //this._velocity.y *= -1;
            this._position.y = boundary.bottomOffsetAbove(this._radius);
            this._velocity = boundary.reflectBottom(this._velocity);
            //const force = Math.abs(this._velocity.y); // TODO: Calculate proper force.
            //if (force <= Math.abs(this._gravityConst)) {
            //    this._velocity.y = 0;
            //    this._allowBounce = false;
            //}
        }
    };
    return TestBall;
}());
var TestBounds = /** @class */ (function () {
    function TestBounds(_canvas) {
        var _this = this;
        this._canvas = _canvas;
        this.animLoop = function () {
            var ctx = _this._ctx;
            ctx.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
            _this.drawGuideLine(_this._orientedBoundsUp);
            _this.drawGuideLine(_this._orientedBoundsDown);
            _this.drawGuideLine(_this._orientedBoundsUpT);
            _this.drawGuideLine(_this._orientedBoundsDownT);
            _this.drawGuideLine(_this._viewportUp);
            _this.drawGuideLine(_this._viewportDown);
            _this.drawGuideLine(_this._viewportUpT);
            _this.drawGuideLine(_this._viewportDownT);
            _this.drawGuideLine(_this._viewportUpU);
            _this.drawGuideLine(_this._viewportDownU);
            _this.drawGuideLine(_this._viewportUpUT);
            _this.drawGuideLine(_this._viewportDownUT);
            _this.drawGuideLine(_this._viewportUpD);
            _this.drawGuideLine(_this._viewportDownD);
            _this.drawGuideLine(_this._viewportUpDT);
            _this.drawGuideLine(_this._viewportDownDT);
            var vpColor = "white";
            var upColor = "purple";
            var dnColor = "blue";
            _this.testOrientedBounds(_this._orientedBoundsUp, _this._orientedLineUp, upColor);
            _this.testOrientedBounds(_this._orientedBoundsDown, _this._orientedLineDown, dnColor);
            _this.testOrientedBoundsT(_this._orientedBoundsUpT, _this._orientedLineUpT, upColor);
            _this.testOrientedBoundsT(_this._orientedBoundsDownT, _this._orientedLineDownT, dnColor);
            _this.testViewport(_this._viewportUp, _this._ballUp, _this._boundsUp, vpColor, upColor);
            _this.testViewport(_this._viewportDown, _this._ballDown, _this._boundsDown, vpColor, dnColor);
            _this.testViewportT(_this._viewportUpT, _this._ballUpT, _this._boundsUpT, vpColor, upColor);
            _this.testViewportT(_this._viewportDownT, _this._ballDownT, _this._boundsDownT, vpColor, dnColor);
            _this.testViewport(_this._viewportUpU, _this._ballUpU, _this._boundsUpU, vpColor, upColor);
            _this.testViewport(_this._viewportDownU, _this._ballDownU, _this._boundsDownU, vpColor, dnColor);
            _this.testViewportT(_this._viewportUpUT, _this._ballUpUT, _this._boundsUpUT, vpColor, upColor);
            _this.testViewportT(_this._viewportDownUT, _this._ballDownUT, _this._boundsDownUT, vpColor, dnColor);
            _this.testViewport(_this._viewportUpD, _this._ballUpD, _this._boundsUpD, vpColor, upColor);
            _this.testViewport(_this._viewportDownD, _this._ballDownD, _this._boundsDownD, vpColor, dnColor);
            _this.testViewportT(_this._viewportUpDT, _this._ballUpDT, _this._boundsUpDT, vpColor, upColor);
            _this.testViewportT(_this._viewportDownDT, _this._ballDownDT, _this._boundsDownDT, vpColor, dnColor);
            requestAnimationFrame(_this.animLoop);
        };
        this._ctx = this._canvas.getContext("2d");
        var sx = 10;
        var sy = 10;
        var sw = 150;
        var sh = 100;
        var sd = 10;
        var sy2 = sy + sh + sd;
        var x = sx;
        var y = sy;
        this._orientedBoundsUp = new OrientedBounds(WorldOrientation.Up, x, y, sw, sh);
        this._orientedLineUp = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));
        y = sy2;
        this._orientedBoundsDown = new OrientedBounds(WorldOrientation.Down, x, sy2, sw, sh);
        this._orientedLineDown = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._orientedBoundsUpT = new OrientedBounds(WorldOrientation.Up, x, y, sw, sh);
        this._orientedLineUpT = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));
        y = sy2;
        this._orientedBoundsDownT = new OrientedBounds(WorldOrientation.Down, x, sy2, sw, sh);
        this._orientedLineDownT = new Line2D(new Vector2D(x + 5, y + 5), new Vector2D(x + sw - 5 - 1, y + sh - 5 - 1));
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        //* // Normal.
        this._viewportUp = new Viewport2D(WorldOrientation.Up, 0, 0, sw, sh, x, y);
        y = sy2;
        this._viewportDown = new Viewport2D(WorldOrientation.Down, 0, 0, sw, sh, x, y);
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._viewportUpT = new Viewport2D(WorldOrientation.Up, 0, 0, sw, sh, x, y);
        y = sy2;
        this._viewportDownT = new Viewport2D(WorldOrientation.Down, 0, 0, sw, sh, x, y);
        this._boundsUp = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUp.width - 20, this._viewportUp.height - 20);
        this._boundsDown = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDown.width - 20, this._viewportDown.height - 20);
        this._ballUp = new TestBall(this._boundsUp.center, new Vector2D(2, 2), 10, "purple", this._boundsUp);
        this._ballDown = new TestBall(this._boundsDown.center, new Vector2D(2, 2), 10, "green", this._boundsDown);
        this._boundsUpT = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpT.width - 20, this._viewportUpT.height - 20);
        this._boundsDownT = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownT.width - 20, this._viewportDownT.height - 20);
        this._ballUpT = new TestBall(this._boundsUpT.center, new Vector2D(2, 2), 10, "purple", this._boundsUpT);
        this._ballDownT = new TestBall(this._boundsDownT.center, new Vector2D(2, 2), 10, "green", this._boundsDownT);
        // Scale up.
        sx = 10;
        sy = sy2 + sh + sd;
        sy2 = sy + sh + sd;
        x = sx;
        y = sy;
        var scale = 0.75;
        this._viewportUpU = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        y = sy2;
        this._viewportDownU = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._viewportUpUT = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        y = sy2;
        this._viewportDownUT = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        this._boundsUpU = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpU.width - 20, this._viewportUpU.height - 20);
        this._boundsDownU = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownU.width - 20, this._viewportDownU.height - 20);
        this._ballUpU = new TestBall(this._boundsUpU.center, new Vector2D(2, 2), 10, "purple", this._boundsUpU);
        this._ballDownU = new TestBall(this._boundsDownU.center, new Vector2D(2, 2), 10, "green", this._boundsDownU);
        this._boundsUpUT = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpUT.width - 20, this._viewportUpUT.height - 20);
        this._boundsDownUT = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownUT.width - 20, this._viewportDownUT.height - 20);
        this._ballUpUT = new TestBall(this._boundsUpUT.center, new Vector2D(2, 2), 10, "purple", this._boundsUpUT);
        this._ballDownUT = new TestBall(this._boundsDownUT.center, new Vector2D(2, 2), 10, "green", this._boundsDownUT);
        // Scale down.
        scale = 2;
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._viewportUpD = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        y = sy2;
        this._viewportDownD = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        sx = sx + sw + sd;
        x = sx;
        y = sy;
        this._viewportUpDT = new Viewport2D(WorldOrientation.Up, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        y = sy2;
        this._viewportDownDT = new Viewport2D(WorldOrientation.Down, 0, 0, sw * scale, sh * scale, x, y, sw, sh);
        this._boundsUpD = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpD.width - 20, this._viewportUpD.height - 20);
        this._boundsDownD = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownD.width - 20, this._viewportDownD.height - 20);
        this._ballUpD = new TestBall(this._boundsUpD.center, new Vector2D(2, 2), 10, "purple", this._boundsUpD);
        this._ballDownD = new TestBall(this._boundsDownD.center, new Vector2D(2, 2), 10, "green", this._boundsDownD);
        this._boundsUpDT = new ContainerBounds(WorldOrientation.Up, 10, 10, this._viewportUpDT.width - 20, this._viewportUpDT.height - 20);
        this._boundsDownDT = new ContainerBounds(WorldOrientation.Down, 10, 10, this._viewportDownDT.width - 20, this._viewportDownDT.height - 20);
        this._ballUpDT = new TestBall(this._boundsUpDT.center, new Vector2D(2, 2), 10, "purple", this._boundsUpDT);
        this._ballDownDT = new TestBall(this._boundsDownDT.center, new Vector2D(2, 2), 10, "green", this._boundsDownDT);
        //console.log(`viewport up scale to screen X: ${this._viewportUp.boundsToScreenScaleX}`);
    }
    TestBounds.prototype.testOrientedBounds = function (bounds, line, color) {
        var ctx = this._ctx;
        bounds.draw(ctx, 2, color, bounds);
        line.draw(ctx, 2, color, bounds);
    };
    TestBounds.prototype.testOrientedBoundsT = function (bounds, line, color) {
        var ctx = this._ctx;
        bounds.applyTransform(ctx);
        bounds.draw(ctx, 2, color);
        line.draw(ctx, 2, color);
        bounds.restoreTransform(ctx);
    };
    TestBounds.prototype.testViewport = function (viewport, ball, bounds, viewportColor, boundsColor) {
        var ctx = this._ctx;
        ball.update();
        viewport.draw(ctx, 2, viewportColor, viewport);
        bounds.draw(ctx, 2, boundsColor, viewport);
        ball.draw(ctx, viewport);
    };
    TestBounds.prototype.testViewportT = function (viewport, ball, bounds, viewportColor, boundsColor) {
        var ctx = this._ctx;
        viewport.applyTransform(ctx);
        ball.update();
        viewport.draw(ctx, 2, viewportColor);
        bounds.draw(ctx, 2, boundsColor);
        ball.draw(ctx);
        viewport.restoreTransform(ctx);
    };
    TestBounds.prototype.drawGuideLine = function (bounds) {
        var ctx = this._ctx;
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.moveTo(bounds.screenRight, bounds.screenTop);
        ctx.lineTo(bounds.screenLeft, bounds.screenTop);
        ctx.stroke();
    };
    TestBounds.prototype.start = function () {
        requestAnimationFrame(this.animLoop);
    };
    return TestBounds;
}());
var handleOnLoad = function () {
    //console.log("In handleOnLoad");
    var canvas = document.getElementById("canvas");
    new TestBounds(canvas).start();
};
window.addEventListener("load", handleOnLoad);
//console.log("In test.js");
//# sourceMappingURL=TestBounds.js.map