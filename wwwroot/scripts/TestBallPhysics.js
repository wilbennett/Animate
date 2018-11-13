"use strict";
var TestBallPhysics = /** @class */ (function () {
    function TestBallPhysics(_canvas, _settings) {
        var _this = this;
        this._canvas = _canvas;
        this._settings = _settings;
        this._rafHandle = -1;
        this.gameLoop = function (timestamp) {
            _this.testBall(_this._worldU);
            _this.testBall(_this._worldD);
            _this._rafHandle = requestAnimationFrame(_this.gameLoop);
        };
        this._ctx = this._canvas.getContext("2d");
        var box = new TestBox(10, 10, 100, 200, 10);
        var radius = 10;
        var ballColor = "blue";
        this._gravityU = new Gravity(WorldOrientation.Up, 0.3);
        this._worldU = new World2D(WorldOrientation.Up, 0, 0, box.w, box.h, box.x, box.y);
        this.createBall(radius, ballColor, this._worldU, this._gravityU);
        box.moveDown();
        this._gravityD = new Gravity(WorldOrientation.Down, 0.3);
        this._worldD = new World2D(WorldOrientation.Down, 0, 0, box.w, box.h, box.x, box.y);
        this.createBall(radius, ballColor, this._worldD, this._gravityD);
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
    TestBallPhysics.prototype.createBall = function (radius, color, world, gravity) {
        var mass = radius * 5;
        mass *= mass;
        var ball = new Ball(radius, color, new Vector2D(world.center.x, world.topOffsetBelow(radius)), new Vector2D(MathEx.random(0, 5), 0), Vector2D.emptyVector, mass, 50, gravity.gravityConst, world.containerBounds, function (ball) { });
        world.addCharacter(ball);
    };
    TestBallPhysics.prototype.testBall = function (world) {
        var ctx = this._ctx;
        world.viewport.draw(ctx, 2, "white");
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