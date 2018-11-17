"use strict";
var BallInfo = /** @class */ (function () {
    function BallInfo() {
        this.maxVelocity = Vector2D.emptyVector;
    }
    return BallInfo;
}());
var TestBallPhysics = /** @class */ (function () {
    function TestBallPhysics(_canvas, _settings) {
        var _this = this;
        this._canvas = _canvas;
        this._settings = _settings;
        this._rafHandle = -1;
        this.gameLoop = function (now) {
            var ctx = _this._ctx;
            ctx.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
            now = now / 1000;
            if (!_this._priorNow)
                _this._priorNow = now;
            var elapsedTime = now - _this._priorNow;
            _this._priorNow = now;
            _this.testBall(_this._worldZeroGU, now, elapsedTime);
            _this.testBall(_this._worldZeroGD, now, elapsedTime);
            _this.testBall(_this._worldGravityU, now, elapsedTime);
            _this.testBall(_this._worldGravityD, now, elapsedTime);
            _this.testBall(_this._worldLiquidU, now, elapsedTime);
            _this.testBall(_this._worldLiquidD, now, elapsedTime);
            _this._rafHandle = requestAnimationFrame(_this.gameLoop);
        };
        this._ctx = this._canvas.getContext("2d");
        var box = new TestBox(10, 10, 40, 200, 10);
        var radius = 15;
        var ballColor = "blue";
        this._worldZeroGU = new World2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        var world = this._worldZeroGU;
        world.setGravity(0);
        var ball = this.createBall(world, world.center.x, radius, ballColor);
        box.moveDown();
        this._worldZeroGD = new World2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldZeroGD;
        world.setGravity(0);
        ball = this.createBall(world, world.center.x, radius, ballColor);
        box.moveUpRight();
        box = new TestBox(box.x, box.y, 100, 200, 10);
        this._worldGravityU = new World2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldGravityU;
        ball = this.createBall(world, world.center.x, radius, ballColor);
        box.moveDown();
        this._worldGravityD = new World2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldGravityD;
        ball = this.createBall(world, world.center.x, radius, ballColor);
        box.moveUpRight();
        this._worldLiquidU = new World2D(this._ctx, WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldLiquidU;
        ball = this.createBall(world, world.center.x, radius, ballColor);
        this.createBall(world, world.x + 5, 10, ballColor, false);
        var drag = 500.4;
        var liquidHeight = world.height / 3;
        var liquid = new Liquid(new Vector2D(world.x, world.offsetBelow(world.center.y, liquidHeight * 0.5)), 2, drag, world.width, liquidHeight);
        world.addForce(liquid);
        world.addCharacter(liquid);
        box.moveDown();
        this._worldLiquidD = new World2D(this._ctx, WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        world = this._worldLiquidD;
        ball = this.createBall(world, world.center.x, radius, ballColor);
        this.createBall(world, world.x + 5, 10, ballColor, false);
        liquid = new Liquid(new Vector2D(world.x, world.offsetAbove(world.center.y, liquidHeight * 0.5)), 2, drag, world.width, liquidHeight);
        world.addForce(liquid);
        world.addCharacter(liquid);
    }
    TestBallPhysics.prototype.setup = function () {
        this._rafHandle = requestAnimationFrame(this.gameLoop);
    };
    TestBallPhysics.prototype.stop = function () {
    };
    TestBallPhysics.prototype.handleSettingsChanged = function () {
        this.cancelFrame();
    };
    TestBallPhysics.prototype.cancelFrame = function () {
        cancelAnimationFrame(this._rafHandle);
    };
    TestBallPhysics.prototype.createBall = function (world, x, radius, color, autoSize, restitution) {
        var _this = this;
        if (autoSize === void 0) { autoSize = true; }
        var mass = radius * 5;
        var ball = new Ball(radius, color, new Vector2D(x, world.topOffsetBelow(radius)), new Vector2D(0, 0), mass, world.containerBounds, function (ball) {
            world.removeCharacter(ball);
            _this.createBall(world, x, autoSize && radius < 30 ? radius + 5 : 10, color, autoSize, restitution);
        }, restitution);
        ball.tag = new BallInfo();
        world.addCharacter(ball);
        return ball;
    };
    TestBallPhysics.prototype.drawBallForce = function (viewport, ball) {
        var ctx = viewport.ctx;
        var position = viewport.toScreen(ball.position);
        ball.calculateForce();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        //ctx.fillText(ball.force.toString(), position.x, position.y);
        ctx.fillText(ball.velocity.toString(), position.x, position.y - 20);
    };
    TestBallPhysics.prototype.testBall = function (world, now, elapsedTime) {
        var _this = this;
        var ctx = this._ctx;
        world.viewport.draw(ctx, 2, "white");
        world.update(0, now, elapsedTime, elapsedTime);
        world.render(0);
        world.characters.forEach(function (character) {
            if (character instanceof Ball) {
                var tag = character.tag;
                //if (character.velocity.y > 0)
                {
                    if (character.velocity.mag > tag.maxVelocity.mag) {
                        //console.log("Ball max velocity: " + character.velocity.toString() +
                        //    " diff: " + character.velocity.subtract(tag.maxVelocity).toString());
                        tag.maxVelocity = character.velocity;
                    }
                }
                _this.drawBallForce(world.viewport, character);
            }
        });
    };
    return TestBallPhysics;
}());
var ballApp;
var startApp = function () {
    if (ballApp) {
        ballApp.stop();
    }
    settings = new CustomEventTarget();
    settings.addEventListener('change', handleSettingsChanged);
    loadSettings();
    var list = document.getElementById("list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    var canvas = document.getElementById("canvas");
    canvas.width = Math.max(window.innerWidth - 20, 300);
    canvas.height = 480;
    ballApp = new TestBallPhysics(canvas, settings);
    ballApp.setup();
};
window.onload = function (e) {
    attachSettingHandlers();
    startApp();
};
//# sourceMappingURL=TestBallPhysics.js.map