﻿class App {
    private readonly ONE_SECOND = 1000;

    private _game: IGame;
    private _ctx: CanvasRenderingContext2D;
    private _stopped: boolean = false;
    private _lastFrameTime = performance.now();
    private _lastFrameTimeAdjusted = this._lastFrameTime;
    private _timeStepDelta = 0;
    private _framesPerSecond = 0;
    private _framesLastSecond = 0;
    private _nextFPSUpdate = 0;
    private _rafHandle = -1;
    private _timeoutHandle = -1;

    private _boundHandleSettingsChanged = this.handleSettingsChanged.bind(this);
    private _targetFPS: number;
    private _statAvgPeriod: number;
    private _frameMode: "raf" | "timeout";
    private _slowTimeout: boolean;
    private _inactiveCutoff: number;

    private _timeStep: number;
    private _timeoutPeriod: number;
    private _emaWeight: number;
    private _emaWeight2: number;
    private _skipped = 0;
    private _deltaUpdate = 0;
    private _maxDeltaUpdate = 0;
    private _maxTimeStepDelta = 0;
    private _frame = 0;
    private _updateTime = 0;
    private _elapsedTime = 0;
    private _statY = 20;

    constructor(canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this._game = new Game(canvas, this._settings);
        this._ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        this._lastFrameTime = performance.now();
        this._settings.addEventListener("change", this._boundHandleSettingsChanged);

        this.handleSettingsChanged();
    }

    public stop(): void {
        this.cancelFrame();
        this._game.stop();
        this._settings.removeEventListener("change", this._boundHandleSettingsChanged);
        this._stopped = true;
    }

    public setup(): void {
        if (this._frameMode === "raf")
            this.gameLoop(0);
        else
            setTimeout(() => this.gameLoop(performance.now()), this._timeoutPeriod);
    }

    public handleSettingsChanged() {
        log("App settings changed");
        this.cancelFrame();
        this._rafHandle = -1;
        this._timeoutHandle = -1;

        const settings = this._settings;
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

        this._game.handleSettingsChanged();
    }

    private requestFrame() {
        if (this._stopped) return;

        if (this._frameMode === "raf")
            requestAnimationFrame(this.gameLoop);
        else
            setTimeout(() => this.gameLoop(performance.now()), this._timeoutPeriod);
    }

    private cancelFrame() {
        if (this._frameMode === "raf" && this._rafHandle >= 0)
            cancelAnimationFrame(this._rafHandle);
        else if (this._frameMode === "timeout" && this._timeoutHandle >= 0)
            clearTimeout(this._timeoutHandle);
    }

    private ema(currentValue: number, priorValue: number) {
        return this._emaWeight * currentValue + this._emaWeight2 * priorValue;
    }

    private showStat(isVisible: boolean, msg: string) {
        if (!isVisible) return;

        this._ctx.strokeText(msg, 0, this._statY);
        this._statY += 20;
    }

    private showStats() {
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
    }

    private gameLoop = (timestamp: DOMHighResTimeStamp) => {
        if (this._stopped) {
            return;
        }

        this.requestFrame();

        if (timestamp < this._lastFrameTimeAdjusted + this._timeStep) {
            this._skipped++;
            return;
        }

        // https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
        // Track the accumulated time that hasn't been simulated yet.
        this._timeStepDelta += timestamp - this._lastFrameTimeAdjusted;
        let elapsedTime = timestamp - this._lastFrameTime;
        let elapsedTimeAdjusted = timestamp - this._lastFrameTimeAdjusted;
        this._lastFrameTime = timestamp;
        this._lastFrameTimeAdjusted = this._lastFrameTime - (elapsedTimeAdjusted % this._timeStep);
        let updateTime = 0;
        let deltaUpdates = 0;

        //*
        // Simulate the total elapsed time in timestep increments.
        // If exceeds inactive cutoff updates, assume user had tabbed away.  Continue where left off.
        if (this._settings.App.pauseInactive && this._timeStepDelta > this._maxTimeStepDelta)
            this._timeStepDelta = this._timeStep;

        if (this._settings.App.fixedTimeStep) {
            while (this._timeStepDelta >= this._timeStep) {
                let startTime = performance.now();
                this._game.update(this._frame, timestamp, 1);
                updateTime = performance.now() - startTime;
                this._timeStepDelta -= this._timeStep;
                this._deltaUpdate++;
                deltaUpdates++;
            }

            if (this._settings.App.interpolate) {
                let startTime = performance.now();
                this._game.update(this._frame, timestamp, this._timeStepDelta / this._timeStep);
                updateTime = performance.now() - startTime;
                this._timeStepDelta = 0;
            }
        } else {
            let delta = this._settings.App.interpolate ? this._timeStepDelta / this._timeStep : 1;
            let startTime = performance.now();
            this._game.update(this._frame, timestamp, delta);
            updateTime = performance.now() - startTime;
            this._timeStepDelta = 0;
        }

        if (deltaUpdates > this._maxDeltaUpdate)
            this._maxDeltaUpdate = deltaUpdates;

        this._game.render(this._frame);

        if (timestamp >= this._nextFPSUpdate) {
            this._framesPerSecond = this.ema(this._framesLastSecond, this._framesPerSecond);
            this._nextFPSUpdate = timestamp + this.ONE_SECOND;
            this._framesLastSecond = 0;
            this._updateTime = this.ema(updateTime, this._updateTime);
            this._elapsedTime = this.ema(elapsedTime, this._elapsedTime);
        }

        this._framesLastSecond++;
        this._frame++;
        this.showStats();
    }
}
