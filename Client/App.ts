class App {
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
    private _deltaUpdateCounter = 0;
    private _maxDeltaUpdateShown = 0;

    private _boundHandleSettingsChanged = this.handleSettingsChanged.bind(this);
    private _targetFPS: number;
    private _statAvgPeriod: number;
    private _frameMode: "raf" | "timeout";
    private _slowTimeout: boolean;
    private _inactiveCutoff: number;

    private _timeStep: number;
    private _nowStep: number;
    private _timeoutPeriod: number;
    private _emaWeight: number;
    private _emaWeight2: number;
    private _skipped = 0;
    private _deltaUpdate = 0;
    private _maxDeltaUpdate = 0;
    private _maxTimeStepDelta = 0;
    private _frame = 0;
    private _updateTime = 0;
    private _renderTime = 0;
    private _elapsedTime = 0;
    private _statY = 20;

    constructor(private _canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this._game = new Game(_canvas, this._settings);
        this._ctx = <CanvasRenderingContext2D>_canvas.getContext("2d");
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
        this._nowStep = this._timeStep / 1000;
        this._timeoutPeriod = this._slowTimeout ? this._timeStep * 2 : this._timeStep;
        this._maxTimeStepDelta = this._timeStep * this._inactiveCutoff;
        this._emaWeight = 2 / (this._statAvgPeriod + 1);
        this._emaWeight2 = 1 - this._emaWeight;

        log("FPS = " + this._targetFPS + " ---> time step: " + this._timeStep.toFixed(5));
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

    private showMaxDeltaUpdates() {
        if (this._deltaUpdateCounter <= 0) return;

        this._deltaUpdateCounter--;
        const ctx = this._ctx;

        ctx.save();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.closePath();

        ctx.font = "20px Arial";
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";
        ctx.lineWidth = 1;
        ctx.strokeText(this._maxDeltaUpdateShown.toFixed(0), this._canvas.width / 2, 20);
        ctx.restore();
    }

    private showStats() {
        this._ctx.save();
        this._ctx.  font = "20px Arial";
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
        this.showStat(this._settings.App.showUpdateTime, this._renderTime.toFixed(2) + " render time (" + (this._updateTime + this._renderTime).toFixed(2) + ")");
        if (this._elapsedTime > this._timeStep) this._ctx.strokeStyle = "red";
        this.showStat(this._settings.App.showElapsedTime, this._elapsedTime.toFixed(2) + " elapsed time");
        this._ctx.restore();
    }

    // TODO: Need to fix a "tick" that happens approx once per second.
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
        let priorNow = this._lastFrameTime / 1000;
        this._lastFrameTime = timestamp;
        this._lastFrameTimeAdjusted = this._lastFrameTime - (elapsedTimeAdjusted % this._timeStep);
        let updateTime = 0;
        let deltaUpdates = 0;
        let deltaUpdatesRaw = 0;

        //*
        // Simulate the total elapsed time in timestep increments.
        // If exceeds inactive cutoff updates, assume user had tabbed away.  Continue where left off.
        if (this._settings.App.pauseInactive && this._timeStepDelta > this._maxTimeStepDelta) {
            deltaUpdatesRaw = Math.floor(this._timeStepDelta / this._timeStep) - 1;
            this._timeStepDelta = this._timeStep;
        }

        let startTime: number;

        if (this._settings.App.fixedTimeStep) {
            let now = priorNow;

            while (this._timeStepDelta >= this._timeStep) {
                now += this._nowStep;
                startTime = performance.now();
                this._game.update(this._frame, now, this._nowStep, 1);
                updateTime = performance.now() - startTime;
                this._timeStepDelta -= this._timeStep;
                deltaUpdates++;
            }

            this._deltaUpdate += deltaUpdates;
            deltaUpdatesRaw += deltaUpdates;

            if (this._settings.App.interpolate && this._timeStepDelta > 0) {
                let nowElapsed = (this._timeStepDelta / this._timeStep) / 1000;
                now = timestamp / 1000;// - nowElapsed;
                startTime = performance.now();
                this._game.update(this._frame, now, nowElapsed, this._timeStepDelta / this._timeStep);
                updateTime = performance.now() - startTime;
                this._timeStepDelta = 0;
            }
        } else {
            let now = timestamp / 1000;
            let nowElapsed = now - priorNow;
            let delta = this._settings.App.interpolate ? this._timeStepDelta / this._timeStep : 1;
            startTime = performance.now();
            this._game.update(this._frame, now, nowElapsed, delta);
            updateTime = performance.now() - startTime;
            this._timeStepDelta = 0;
        }

        if (deltaUpdates > this._maxDeltaUpdate)
            this._maxDeltaUpdate = deltaUpdates;

        if (deltaUpdatesRaw > 2 && (deltaUpdatesRaw > this._maxDeltaUpdateShown)) {// || this._deltaUpdateCounter <= 0)) {
            this._maxDeltaUpdateShown = deltaUpdatesRaw;
            this._deltaUpdateCounter = this._targetFPS * 5;
        }

        startTime = performance.now();
        this._game.render(this._frame);
        let renderTime = performance.now() - startTime;

        if (timestamp >= this._nextFPSUpdate) {
            this._framesPerSecond = this.ema(this._framesLastSecond, this._framesPerSecond);
            this._nextFPSUpdate = timestamp + this.ONE_SECOND;
            this._framesLastSecond = 0;
            this._updateTime = this.ema(updateTime, this._updateTime);
            this._renderTime = this.ema(renderTime, this._renderTime);
            this._elapsedTime = this.ema(elapsedTime, this._elapsedTime);
        }

        this._framesLastSecond++;
        this._frame++;
        this.showMaxDeltaUpdates();
        this.showStats();
    }
}

var app: App;

var startApp = function () {
    if (app) {
        app.stop();
    }

    settings = new CustomEventTarget();
    settings.addEventListener('change', handleSettingsChanged);

    loadSettings();
    let list = <HTMLUListElement>document.getElementById("list");

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = Math.max(window.innerWidth - 20, 300);
    canvas.height = 480;
    app = new App(canvas, settings);
    app.setup();
}

window.onload = e => {
    attachSettingHandlers();
    startApp();
}
