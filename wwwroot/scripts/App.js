"use strict";
var App = /** @class */ (function () {
    function App(_canvas, _settings) {
        var _this = this;
        this._canvas = _canvas;
        this._settings = _settings;
        this.ONE_SECOND = 1000;
        this._stopped = false;
        this._lastFrameTime = performance.now();
        this._lastFrameTimeAdjusted = this._lastFrameTime;
        this._timeStepDelta = 0;
        this._framesPerSecond = 0;
        this._framesLastSecond = 0;
        this._nextFPSUpdate = 0;
        this._rafHandle = -1;
        this._timeoutHandle = -1;
        this._deltaUpdateCounter = 0;
        this._maxDeltaUpdateShown = 0;
        this._boundHandleSettingsChanged = this.handleSettingsChanged.bind(this);
        this._skipped = 0;
        this._deltaUpdate = 0;
        this._maxDeltaUpdate = 0;
        this._maxTimeStepDelta = 0;
        this._frame = 0;
        this._updateTime = 0;
        this._elapsedTime = 0;
        this._statY = 20;
        this.gameLoop = function (timestamp) {
            if (_this._stopped) {
                return;
            }
            _this.requestFrame();
            if (timestamp < _this._lastFrameTimeAdjusted + _this._timeStep) {
                _this._skipped++;
                return;
            }
            // https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
            // Track the accumulated time that hasn't been simulated yet.
            _this._timeStepDelta += timestamp - _this._lastFrameTimeAdjusted;
            var elapsedTime = timestamp - _this._lastFrameTime;
            var elapsedTimeAdjusted = timestamp - _this._lastFrameTimeAdjusted;
            _this._lastFrameTime = timestamp;
            _this._lastFrameTimeAdjusted = _this._lastFrameTime - (elapsedTimeAdjusted % _this._timeStep);
            var updateTime = 0;
            var deltaUpdates = 0;
            var deltaUpdatesRaw = 0;
            //*
            // Simulate the total elapsed time in timestep increments.
            // If exceeds inactive cutoff updates, assume user had tabbed away.  Continue where left off.
            if (_this._settings.App.pauseInactive && _this._timeStepDelta > _this._maxTimeStepDelta) {
                deltaUpdatesRaw = Math.floor(_this._timeStepDelta / _this._timeStep) - 1;
                _this._timeStepDelta = _this._timeStep;
            }
            var startTime;
            if (_this._settings.App.fixedTimeStep) {
                while (_this._timeStepDelta >= _this._timeStep) {
                    startTime = performance.now();
                    _this._game.update(_this._frame, timestamp, 1);
                    updateTime = performance.now() - startTime;
                    _this._timeStepDelta -= _this._timeStep;
                    deltaUpdates++;
                }
                _this._deltaUpdate += deltaUpdates;
                deltaUpdatesRaw += deltaUpdates;
                if (_this._settings.App.interpolate) {
                    startTime = performance.now();
                    _this._game.update(_this._frame, timestamp, _this._timeStepDelta / _this._timeStep);
                    updateTime = performance.now() - startTime;
                    _this._timeStepDelta = 0;
                }
            }
            else {
                var delta = _this._settings.App.interpolate ? _this._timeStepDelta / _this._timeStep : 1;
                startTime = performance.now();
                _this._game.update(_this._frame, timestamp, delta);
                updateTime = performance.now() - startTime;
                _this._timeStepDelta = 0;
            }
            if (deltaUpdates > _this._maxDeltaUpdate)
                _this._maxDeltaUpdate = deltaUpdates;
            if (deltaUpdatesRaw > 2 && (deltaUpdatesRaw > _this._maxDeltaUpdateShown || _this._deltaUpdateCounter <= 0)) {
                _this._maxDeltaUpdateShown = deltaUpdatesRaw;
                _this._deltaUpdateCounter = _this._targetFPS * 5;
            }
            _this._game.render(_this._frame);
            if (timestamp >= _this._nextFPSUpdate) {
                _this._framesPerSecond = _this.ema(_this._framesLastSecond, _this._framesPerSecond);
                _this._nextFPSUpdate = timestamp + _this.ONE_SECOND;
                _this._framesLastSecond = 0;
                _this._updateTime = _this.ema(updateTime, _this._updateTime);
                _this._elapsedTime = _this.ema(elapsedTime, _this._elapsedTime);
            }
            _this._framesLastSecond++;
            _this._frame++;
            _this.showMaxDeltaUpdates();
            _this.showStats();
        };
        this._game = new Game(_canvas, this._settings);
        this._ctx = _canvas.getContext("2d");
        this._lastFrameTime = performance.now();
        this._settings.addEventListener("change", this._boundHandleSettingsChanged);
        this.handleSettingsChanged();
    }
    App.prototype.stop = function () {
        this.cancelFrame();
        this._game.stop();
        this._settings.removeEventListener("change", this._boundHandleSettingsChanged);
        this._stopped = true;
    };
    App.prototype.setup = function () {
        var _this = this;
        if (this._frameMode === "raf")
            this.gameLoop(0);
        else
            setTimeout(function () { return _this.gameLoop(performance.now()); }, this._timeoutPeriod);
    };
    App.prototype.handleSettingsChanged = function () {
        log("App settings changed");
        this.cancelFrame();
        this._rafHandle = -1;
        this._timeoutHandle = -1;
        var settings = this._settings;
        this._targetFPS = settings.App.targetFPS;
        this._statAvgPeriod = settings.App.statAvgPeriod;
        this._frameMode = settings.App.frameMode;
        this._slowTimeout = settings.App.slowTimeout;
        this._inactiveCutoff = settings.App.inactiveCutoff;
        this._timeStep = this.ONE_SECOND / this._targetFPS;
        this._timeoutPeriod = this._slowTimeout ? this._timeStep * 2 : this._timeStep;
        this._maxTimeStepDelta = this._timeStep * this._inactiveCutoff;
        this._emaWeight = 2 / (this._statAvgPeriod + 1);
        this._emaWeight2 = 1 - this._emaWeight;
        log("FPS = " + this._targetFPS + " ---> time step: " + this._timeStep.toFixed(2));
    };
    App.prototype.requestFrame = function () {
        var _this = this;
        if (this._stopped)
            return;
        if (this._frameMode === "raf")
            requestAnimationFrame(this.gameLoop);
        else
            setTimeout(function () { return _this.gameLoop(performance.now()); }, this._timeoutPeriod);
    };
    App.prototype.cancelFrame = function () {
        if (this._frameMode === "raf" && this._rafHandle >= 0)
            cancelAnimationFrame(this._rafHandle);
        else if (this._frameMode === "timeout" && this._timeoutHandle >= 0)
            clearTimeout(this._timeoutHandle);
    };
    App.prototype.ema = function (currentValue, priorValue) {
        return this._emaWeight * currentValue + this._emaWeight2 * priorValue;
    };
    App.prototype.showStat = function (isVisible, msg) {
        if (!isVisible)
            return;
        this._ctx.strokeText(msg, 0, this._statY);
        this._statY += 20;
    };
    App.prototype.showMaxDeltaUpdates = function () {
        if (this._deltaUpdateCounter <= 0)
            return;
        this._deltaUpdateCounter--;
        var ctx = this._ctx;
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.closePath();
        ctx.font = "20px Arial";
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";
        ctx.lineWidth = 1;
        ctx.strokeText(this._maxDeltaUpdateShown.toFixed(0), this._canvas.width / 2, 20);
        ctx.restore();
    };
    App.prototype.showStats = function () {
        this._ctx.save();
        this._ctx.font = "20px Arial";
        this._statY = 20;
        this._ctx.strokeStyle = "black";
        this._ctx.textAlign = "topleft";
        this.showStat(this._settings.App.showTime, currentTimeFormat(false));
        this.showStat(this._settings.App.showFPS, this._framesPerSecond.toFixed(2) + " fps");
        this.showStat(this._settings.App.showSkipped, this._skipped + " skipped");
        this.showStat(this._settings.App.showUpdates, this._deltaUpdate + " updates");
        this.showStat(this._settings.App.showConsUpdates, this._maxDeltaUpdate + " cons. updates");
        this.showStat(this._settings.App.showFrameCount, this._frame + " frames " + (this._frame / this._deltaUpdate * 100).toFixed(2) + " %");
        this.showStat(this._settings.App.showUpdateTime, this._updateTime.toFixed(2) + " update time");
        this.showStat(this._settings.App.showElapsedTime, this._elapsedTime.toFixed(2) + " elapsed time");
        this._ctx.restore();
    };
    return App;
}());
var app;
var startApp = function () {
    if (app) {
        app.stop();
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
    app = new App(canvas, settings);
    app.setup();
};
window.onload = function (e) {
    attachSettingHandlers();
    startApp();
};
//# sourceMappingURL=App.js.map