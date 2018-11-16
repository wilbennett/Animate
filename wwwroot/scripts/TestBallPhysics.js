"use strict";
var TestBallPhysics = /** @class */ (function () {
    function TestBallPhysics(_canvas, _settings) {
        var _this = this;
        this._canvas = _canvas;
        this._settings = _settings;
        this._rafHandle = -1;
        this.gameLoop = function (now) {
            var ctx = _this._ctx;
            ctx.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
            _this.testBall(_this._worldZeroGU, now);
            _this.testBall(_this._worldZeroGD, now);
            _this.testBall(_this._worldGravityU, now);
            _this.testBall(_this._worldGravityD, now);
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
    TestBallPhysics.prototype.createBall = function (world, x, radius, color, restitution) {
        var _this = this;
        var mass = radius * 5;
        var ball = new Ball(radius, color, new Vector2D(x, world.topOffsetBelow(radius)), new Vector2D(0, 0), mass, world.containerBounds, function (ball) {
            world.removeCharacter(ball);
            _this.createBall(world, x, radius < 30 ? radius + 5 : 10, color, restitution);
        }, restitution);
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
        ctx.fillText(ball.force.toString(), position.x, position.y);
        //ctx.fillText(ball.momentum.toString(), position.x, position.y - 20);
    };
    TestBallPhysics.prototype.testBall = function (world, now) {
        var _this = this;
        var ctx = this._ctx;
        world.viewport.draw(ctx, 2, "white");
        world.update(0, now, 1);
        world.render(0);
        world.characters.forEach(function (character) {
            if (character instanceof Ball)
                _this.drawBallForce(world.viewport, character);
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