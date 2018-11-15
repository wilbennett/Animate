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
            _this._rafHandle = requestAnimationFrame(_this.gameLoop);
        };
        this._ctx = this._canvas.getContext("2d");
        var box = new TestBox(10, 10, 40, 200, 10);
        var radius = 10;
        var ballColor = "blue";
        this._worldZeroGU = new World2D(WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        this._worldZeroGU.setGravity(0);
        var ball = this.createBall(this._worldZeroGU.center.x, radius, ballColor, this._worldZeroGU);
        box.moveDown();
        this._worldZeroGD = new World2D(WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        this._worldZeroGD.setGravity(0);
        ball = this.createBall(this._worldZeroGD.center.x, radius, ballColor, this._worldZeroGD);
        box.moveUpRight();
        box = new TestBox(box.x, box.y, 40, 200, 10);
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
    TestBallPhysics.prototype.createBall = function (x, radius, color, world) {
        var _this = this;
        var mass = radius * 5;
        var ball = new Ball(radius, color, new Vector2D(x, world.topOffsetBelow(radius)), new Vector2D(0, 0), mass, world.containerBounds, function (ball) {
            world.removeCharacter(ball);
            _this.createBall(x, radius < 30 ? radius + 5 : 10, color, world);
        });
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