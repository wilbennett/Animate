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
            _this.testBall(_this._worldU, now);
            _this.testBall(_this._worldD, now);
            _this._rafHandle = requestAnimationFrame(_this.gameLoop);
        };
        this._ctx = this._canvas.getContext("2d");
        var box = new TestBox(10, 10, 100, 200, 10);
        var radius = 10;
        var ballColor = "blue";
        this._worldU = new World2D(WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        //this._worldU.setGravity(0);
        var ball = this.createBall(radius, ballColor, this._worldU);
        ball.addUniversalForce(new Friction());
        ball.frictionCoeffecient = ball.mass * 0.01;
        box.moveDown();
        this._worldD = new World2D(WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        this._worldD.setGravity(0);
        ball = this.createBall(radius, ballColor, this._worldD);
        ball.addUniversalForce(new Friction());
        ball.frictionCoeffecient = ball.mass * 0.01;
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
    TestBallPhysics.prototype.createBall = function (radius, color, world) {
        var _this = this;
        var mass = radius * 1;
        var ball = new Ball(radius, color, new Vector2D(world.center.x, world.topOffsetBelow(radius + 5)), new Vector2D(0, 0), Vector2D.emptyVector, mass, 1500, world.gravity.gravityConst, world.containerBounds, function (ball) {
            world.removeCharacter(ball);
            _this.createBall(radius, color, world);
        });
        ball.addUniversalForce(world.gravity);
        world.addCharacter(ball);
        return ball;
    };
    TestBallPhysics.prototype.testBall = function (world, now) {
        var ctx = this._ctx;
        world.viewport.draw(ctx, 2, "white");
        world.update(0, now, 1);
        world.render(ctx, 0);
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