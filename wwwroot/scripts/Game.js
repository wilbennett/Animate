"use strict";
var Game = /** @class */ (function () {
    function Game(_canvas, _settings) {
        var _this = this;
        this._canvas = _canvas;
        this._settings = _settings;
        this._height = window.innerHeight;
        this._width = window.innerWidth;
        this._balls = [];
        this._ballsToRemove = [];
        this._viewportDeltaX = 2;
        this._viewportDeltaY = 0;
        this._backgroundOffset = 0;
        this._backgroundDelta = 0.002;
        this._boundHandleSettingsChanged = this.handleSettingsChanged.bind(this);
        this.addBallToRemove = function (ball) { return _this._ballsToRemove.push(ball); };
        this.paintViewportBackground = function (view) {
            var ctx = view.ctx;
            ctx.fillStyle = _this._backgroundGradient;
            var bounds = _this._world;
            ctx.beginPath();
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            ctx.closePath();
            ctx.beginPath();
            bounds = bounds.inflate(-15, -15);
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            ctx.closePath();
        };
        this._ctx = this._canvas.getContext("2d");
        this._height = this._canvas.height;
        this._width = this._canvas.width;
        var ctx = this._ctx;
        var width = this._width;
        var height = this._height;
        var screenLeft = 200;
        var screenTop = 0;
        var orientation = _settings.World.up ? WorldOrientation.Up : WorldOrientation.Down;
        var worldWidth = _settings.World.wide ? width * 1.5 : width - screenLeft;
        var worldHeight = _settings.World.tall ? height * 1.5 : height - screenTop;
        var screenWidth = this._width - screenLeft;
        var screenHeight = this._height - screenTop;
        //this._world = new World2D(ctx, orientation, 0, 0, worldWidth, worldHeight, screenLeft, screenTop);
        this._world = new World2D(ctx, orientation, 0, 0, worldWidth, worldHeight, screenLeft, screenTop, screenWidth, screenHeight);
        var world = this._world;
        //world.setGravity(5);
        world.beforeRenderViewport = this.paintViewportBackground;
        var aspectRatio = world.height / world.width;
        var screenWidth2 = this._width - screenWidth - 2;
        var screenHeight2 = screenWidth2 * aspectRatio;
        var screenLeft2 = 0;
        var screenTop2 = this._height - screenHeight2 + 1;
        world.addViewport(world.x, world.y, world.width, world.height, screenLeft2, screenTop2, world.ctx, screenWidth2, screenHeight2);
        var screenLeft3 = 0;
        var screenTop3 = screenTop2 - screenHeight2 + 1 - 5;
        var viewWidth3 = world.width * 0.4;
        var viewHeight3 = viewWidth3 * aspectRatio;
        world.addViewport(world.centerX - Math.round(viewWidth3 / 2), world.centerY - Math.round(viewHeight3 / 2), viewWidth3, viewHeight3, screenLeft3, screenTop3, world.ctx, screenWidth2, screenHeight2);
        var screenWidth4 = screenWidth2;
        var screenHeight4 = screenHeight2;
        var screenLeft4 = screenLeft;
        var screenTop4 = screenTop2;
        world.addViewport(world.x, world.y, world.width, world.height, screenLeft4, screenTop4, world.ctx, screenWidth4, screenHeight4);
        this._canvasMouse = new MouseTracker(this._canvas);
        this._output = document.getElementById("output");
        this._friction = new Friction(world.origin, world.width, world.height);
        this._liquid = new Fluid(2, 100, new Vector2D(world.x, world.bottomOffsetAbove(200)), world.width / 8, 90);
        this._radar = new Radar(world.center, Math.min(worldWidth, worldHeight) / 2 * 0.90, "purple", MathEx.TWO_PI / 60 * 2);
        world.addForce(this._liquid);
        world.addCharacter(this._liquid);
        world.addCharacter(this._radar);
        this._leftFan = this.createFan(world.left, this._settings.LeftFan);
        this._rightFan = this.createFan(world.right, this._settings.RightFan);
        this._centerFan = this.createFan(world.center.x, this._settings.RightFan);
        this._centerFan.position = world.center;
        world.addForce(this._leftFan);
        world.addForce(this._rightFan);
        world.addForce(this._centerFan);
        world.addCharacter(this._leftFan);
        world.addCharacter(this._centerFan);
        this._settings.addEventListener("change", this._boundHandleSettingsChanged);
        this.handleSettingsChanged();
    }
    Game.prototype.handleSettingsChanged = function () {
        log("Game settings changed");
        var mult;
        if (Math.abs(this._viewportDeltaX) !== Math.abs(this._settings.Viewport.deltaX)) {
            mult = this._viewportDeltaX >= 0 ? 1 : -1;
            this._viewportDeltaX = this._settings.Viewport.deltaX * mult;
        }
        if (Math.abs(this._viewportDeltaY) !== Math.abs(this._settings.Viewport.deltaY)) {
            mult = this._viewportDeltaY >= 0 ? 1 : -1;
            this._viewportDeltaY = this._settings.Viewport.deltaY * mult;
        }
        this._backColorStart = this._settings.World.backColorStart || "blue";
        this._backColorEnd = this._settings.World.backColorEnd || "lightgreen";
        this.createBackgroundGradient();
        this.updateFan(this._leftFan, this._settings.LeftFan);
        this.updateFan(this._rightFan, this._settings.RightFan);
    };
    Game.prototype.createFan = function (x, settings) {
        var world = this._world;
        var fanPos = settings.position;
        var fanAngle = settings.angle;
        var fanSpeed = settings.speed;
        var fanRadius = settings.radius;
        return new Wind(fanSpeed, world.localizeDegrees(fanAngle), new Vector2D(x, world.bottomOffsetAbove(world.height * fanPos)), fanRadius);
    };
    Game.prototype.createRandomBalls = function () {
        var colors = this._settings.Balls.colors || ['blue', 'green', 'red', 'black', 'white'];
        var container = this._world.containerBounds;
        var ballCount = this._settings.Balls.count;
        //ballCount = 1;
        for (var i = 0; i < ballCount; i++) {
            var radius = MathEx.random(this._settings.Balls.minSize, this._settings.Balls.maxSize);
            var mass = radius * 2;
            var color = MathEx.random(colors);
            //color = "blue";
            var startY = this._world.viewport.topOffsetBelow(radius);
            var ball = new Ball(radius, color, new Vector2D(MathEx.random(radius, this._width - radius * 2), startY), new Vector2D(MathEx.random(0, 5), 0), mass, container, this.addBallToRemove);
            ball.frictionCoefficient = this._settings.Balls.frictionCoefficient * (ball.radius * ball.radius / 2);
            this._balls[i] = ball;
            this._world.addCharacter(ball);
        }
    };
    Game.prototype.removeBall = function (ball) {
        this._world.removeCharacter(ball);
        var index = this._balls.indexOf(ball);
        if (index >= 0)
            this._balls.splice(index, 1);
    };
    Game.prototype.processBallsToRemove = function () {
        var _this = this;
        this._ballsToRemove.forEach(function (ball) { return _this.removeBall(ball); }, this);
        this._ballsToRemove = [];
    };
    Game.prototype.updateViewport = function () {
        var world = this._world;
        if (this._settings.Viewport.movement === "Horizontal") {
            if (!world.moveViewportHorizontal(this._viewportDeltaX)) {
                this._viewportDeltaX = -this._viewportDeltaX;
            }
        }
        else if (this._settings.Viewport.movement === "Vertical") {
            if (!world.moveViewportVertical(this._viewportDeltaY)) {
                this._viewportDeltaY = -this._viewportDeltaY;
            }
        }
        else if (this._settings.Viewport.movement === "Rotate") {
            world.centerViewportAt(this._radar.armPos.x, this._radar.armPos.y);
        }
    };
    Game.prototype.createBackgroundGradient = function () {
        var ctx = this._ctx;
        var world = this._world;
        var viewport = world.viewport;
        var center = world.center;
        viewport.applyTransform();
        this._backgroundOffset += this._backgroundDelta;
        if (this._backgroundOffset < 0.6) {
            this._backgroundOffset = 0.6;
            this._backgroundDelta = -this._backgroundDelta;
        }
        if (this._backgroundOffset > 1) {
            this._backgroundOffset = 1;
            this._backgroundDelta = -this._backgroundDelta;
        }
        //this.backgroundGradient = ctx.createLinearGradient(0, 0, world.width, world.height);
        this._backgroundGradient = ctx.createRadialGradient(center.x, center.y, 2, center.x, center.y, world.width / 2);
        this._backgroundGradient.addColorStop(0, this._backColorStart);
        this._backgroundGradient.addColorStop(this._backgroundOffset, this._backColorEnd);
        //this.backgroundGradient.addColorStop(1, this.paintedBackStart);
        viewport.restoreTransform();
    };
    Game.prototype.paintBackground = function () {
        var ctx = this._ctx;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillRect(0, 0, this._width, this._height);
        ctx.closePath();
    };
    Game.prototype.updateFan = function (fan, settings) {
        var world = this._world;
        var fanPos = settings.position;
        var fanAngle = settings.angle;
        var fanSpeed = settings.speed;
        fan.position = fan.position.withY(world.bottomOffsetAbove(world.height * fanPos));
        fan.degrees = world.localizeDegrees(fanAngle);
        fan.speed = fanSpeed;
    };
    Game.prototype.paintRadarAngle = function () {
        var _this = this;
        var world = this._world;
        var fontSize = 20;
        world.viewports
            //.slice(0, 2)
            .forEach(function (view) {
            var ctx = view.ctx;
            fontSize = fontSize * Math.min(view.boundsToScreenScaleX, view.boundsToScreenScaleY);
            ctx.save();
            ctx.font = fontSize + "px Arial";
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.textAlign = "center";
            var radarPos = view.toScreen(_this._radar.position);
            ctx.fillText(_this._radar.degrees.toFixed(0).toString(), radarPos.x, radarPos.y);
            ctx.restore();
        }, this);
    };
    Game.prototype.update = function (frame, now, elapsedTime, timeScale) {
        //return;
        this.updateViewport();
        this.createBackgroundGradient();
        if (this._balls.length === 0)
            this.createRandomBalls();
        this._centerFan.degrees += this._radar.rotateVelocity; // * elapsedTime;
        if (now % 5 === 0)
            this._centerFan.speed = MathEx.random(5, 70);
        this._world.update(frame, now, elapsedTime, timeScale);
        this.processBallsToRemove();
        this._liquid.position = new Vector2D(this._radar.armPos.x - this._liquid.bounds.width / 2, this._radar.armPos.y - this._liquid.bounds.height / 2);
    };
    Game.prototype.render = function (frame) {
        this.paintBackground();
        //return;
        var world = this._world;
        var viewport = world.viewport;
        viewport = world.viewports[2];
        this._world.render(frame);
        this.paintRadarAngle();
        //return;
        if (this._balls.length === 0)
            return;
        //let ball = this.balls[0];
        this._output.innerHTML = "" +
            //"(" + this._canvasMouse.x + ", " + this._canvasMouse.y + ") <br/>" +
            "world: " + world + "<br/>" +
            "viewport: " + viewport + "<br/>" +
            "viewport left: " + viewport.left.toFixed(0) + "<br/>" +
            "viewport top: " + viewport.top.toFixed(0) + "<br/>" +
            "viewport right: " + viewport.right.toFixed(0) + "<br/>" +
            "viewport bottom: " + viewport.bottom.toFixed(0) + "<br/>" +
            "viewport width: " + viewport.width.toFixed(0) + "<br/>" +
            "viewport height: " + viewport.height.toFixed(0) + "<br/>" +
            "viewport Screen: (" + viewport.screenLeft.toFixed(0) + ", " + viewport.screenTop.toFixed(0) + ")  (" + viewport.screenWidth.toFixed(0) + ", " + viewport.screenHeight.toFixed(0) + ")" + "<br/>" +
            //"position: " + ball.position.toString() + "<br/>" +
            //"acceleration: " + ball.acceleration.toString() + "<br/>" +
            //"velocity: " + ball.velocity.toString() + "<br/>" +
            //"velocity mag: " + ball.velocity.mag.toFixed(3) + "<br/>" +
            //"velocity radians: " + ball.velocity.radians.toFixed(3) + "<br/>" +
            //"velocity angle: " + ball.velocity.degrees.toFixed(1) + "<br/>" +
            //"rotate velocity: " + ball.rotateVelocity.toFixed(2) + "<br/>" +
            //"gravity: " + this._world.gravity.gravityConst.toFixed(3) + "<br/>" +
            "";
    };
    Game.prototype.stop = function () {
        this._settings.removeEventListener("change", this._boundHandleSettingsChanged);
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map