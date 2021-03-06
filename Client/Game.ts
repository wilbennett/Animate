﻿class Game {
    private _ctx: CanvasRenderingContext2D;
    private _height: number = window.innerHeight;
    private _width: number = window.innerWidth;
    private _canvasMouse: MouseTracker;
    private _output: HTMLOutputElement;
    private _friction: Force;
    private _liquid: Fluid;
    private _radar: Radar;
    private _leftFan: Wind;
    private _rightFan: Wind;
    private _centerFan: Wind;
    private _world: World2D;
    private _balls: Ball[] = [];
    private _ballsToRemove: Ball[] = [];
    private _backgroundGradient: CanvasGradient;
    private _backColorStart: string;
    private _backColorEnd: string;
    private _viewportDeltaX = 2;
    private _viewportDeltaY = 0;
    private _backgroundOffset = 0;
    private _backgroundDelta = 0.002;
    private _boundHandleSettingsChanged = this.handleSettingsChanged.bind(this);

    constructor(private _canvas: HTMLCanvasElement, private _settings: Dynamic) {
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext("2d");
        this._height = this._canvas.height;
        this._width = this._canvas.width;
        const ctx = this._ctx;
        const width = this._width;
        const height = this._height;

        const screenLeft = 200;
        const screenTop = 0;
        const orientation = _settings.World.up ? WorldOrientation.Up : WorldOrientation.Down;
        const worldWidth = _settings.World.wide ? width * 1.5 : width - screenLeft;
        const worldHeight = _settings.World.tall ? height * 1.5 : height - screenTop;
        const screenWidth = this._width - screenLeft;
        const screenHeight = this._height - screenTop;
        //this._world = new World2D(ctx, orientation, 0, 0, worldWidth, worldHeight, screenLeft, screenTop);
        this._world = new World2D(
            ctx,
            orientation,
            0,
            0,
            worldWidth,
            worldHeight,
            screenLeft,
            screenTop,
            screenWidth,
            screenHeight);
        const world = this._world;
        //world.setGravity(5);
        world.beforeRenderViewport = this.paintViewportBackground;

        let aspectRatio = world.height / world.width;
        const screenWidth2 = this._width - screenWidth - 2;
        const screenHeight2 = screenWidth2 * aspectRatio;
        const screenLeft2 = 0;
        const screenTop2 = this._height - screenHeight2 + 1;
        world.addViewport(
            world.x,
            world.y,
            world.width,
            world.height,
            screenLeft2,
            screenTop2,
            world.ctx,
            screenWidth2,
            screenHeight2);
        const screenLeft3 = 0;
        const screenTop3 = screenTop2 - screenHeight2 + 1 - 5;
        let viewWidth3 = world.width * 0.4;
        let viewHeight3 = viewWidth3 * aspectRatio;
        world.addViewport(
            world.centerX - Math.round(viewWidth3 / 2),
            world.centerY - Math.round(viewHeight3 / 2),
            viewWidth3,
            viewHeight3,
            screenLeft3,
            screenTop3,
            world.ctx,
            screenWidth2,
            screenHeight2);
        const screenWidth4 = screenWidth2;
        const screenHeight4 = screenHeight2;
        const screenLeft4 = screenLeft;
        const screenTop4 = screenTop2;
        world.addViewport(
            world.x,
            world.y,
            world.width,
            world.height,
            screenLeft4,
            screenTop4,
            world.ctx,
            screenWidth4,
            screenHeight4);

        this._canvasMouse = new MouseTracker(this._canvas);

        this._output = <HTMLOutputElement>document.getElementById("output");
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
        world.addCharacter(this._rightFan);
        world.addCharacter(this._centerFan);

        this._settings.addEventListener("change", this._boundHandleSettingsChanged);
        this.handleSettingsChanged();
    }

    public handleSettingsChanged() {
        log("Game settings changed");
        let mult: number;

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
    }

    private createFan(x: number, settings: Dynamic) {
        const world = this._world;

        let fanPos = settings.position;
        let fanAngle = settings.angle;
        let fanSpeed = settings.speed;
        let fanRadius = settings.radius;

        return new Wind(
            fanSpeed,
            world.localizeDegrees(fanAngle),
            new Vector2D(x, world.bottomOffsetAbove(world.height * fanPos)),
            fanRadius);
    }

    private createRandomBalls() {
        let colors: string[] = this._settings.Balls.colors || ['blue', 'green', 'red', 'black', 'white'];
        let container = this._world.containerBounds;
        let ballCount = this._settings.Balls.count;
        //ballCount = 1;

        for (var i = 0; i < ballCount; i++) {
            let radius = MathEx.random(this._settings.Balls.minSize, this._settings.Balls.maxSize);
            let mass = radius * 2;
            let color = MathEx.random(colors);
            //color = "blue";
            let startY = this._world.viewport.topOffsetBelow(radius);
            let ball = new Ball(
                radius,
                color,
                new Vector2D(MathEx.random(radius, this._width - radius * 2), startY),
                new Vector2D(MathEx.random(0, 5), 0),
                mass,
                container,
                this.addBallToRemove);

            ball.frictionCoefficient = this._settings.Balls.frictionCoefficient * (ball.radius * ball.radius / 2);
            this._balls[i] = ball;
            this._world.addCharacter(ball);
        }
    }

    private removeBall(ball: Ball) {
        this._world.removeCharacter(ball);
        let index = this._balls.indexOf(ball);

        if (index >= 0)
            this._balls.splice(index, 1);
    }

    private addBallToRemove = (ball: Ball) => this._ballsToRemove.push(ball);

    private processBallsToRemove() {
        this._ballsToRemove.forEach(ball => this.removeBall(ball), this);
        this._ballsToRemove = [];
    }

    private updateViewport() {
        const world = this._world;

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
    }

    private createBackgroundGradient() {
        const ctx = this._ctx;
        const world = this._world;
        const viewport = world.viewport;
        const center = world.center;

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
    }

    paintViewportBackground = (view: Viewport2D) => {
        const ctx = view.ctx;

        ctx.fillStyle = this._backgroundGradient;
        let bounds: Bounds = this._world;
        ctx.beginPath();
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.closePath();

        ctx.beginPath();
        bounds = bounds.inflate(-15, -15);
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.closePath();
    }

    private paintBackground() {
        const ctx = this._ctx;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillRect(0, 0, this._width, this._height);
        ctx.closePath();
    }

    private updateFan(fan: Wind, settings: Dynamic) {
        const world = this._world;

        let fanPos = settings.position;
        let fanAngle = settings.angle;
        let fanSpeed = settings.speed;

        fan.position = fan.position.withY(world.bottomOffsetAbove(world.height * fanPos));
        fan.degrees = world.localizeDegrees(fanAngle);
        fan.speed = fanSpeed;
    }

    private paintRadarAngle() {
        const world = this._world;
        let fontSize = 20;

        world.viewports
            //.slice(0, 2)
            .forEach(view => {
                const ctx = view.ctx;
                fontSize = fontSize * Math.min(view.boundsToScreenScaleX, view.boundsToScreenScaleY);

                ctx.save();
                ctx.font = fontSize + "px Arial";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                let radarPos = view.toScreen(this._radar.position);
                ctx.fillText(this._radar.degrees.toFixed(0).toString(), radarPos.x, radarPos.y);
                ctx.restore();
            }, this);
    }

    public update(frame: number, now: number, elapsedTime: number, timeScale: number): void {
        //return;
        this.updateViewport();
        this.createBackgroundGradient();

        if (this._balls.length === 0)
            this.createRandomBalls();

        this._centerFan.degrees += this._radar.rotateVelocity;// * elapsedTime;

        if (now % 5 === 0)
            this._centerFan.speed = MathEx.random(5, 70);

        this._world.update(frame, now, elapsedTime, timeScale);
        this.processBallsToRemove();

        this._liquid.position = new Vector2D(
            this._radar.armPos.x - this._liquid.bounds.width / 2,
            this._radar.armPos.y - this._liquid.bounds.height / 2);
    }

    public render(frame: number): void {
        this.paintBackground();
        //return;

        const world = this._world;
        let viewport = world.viewport;
        viewport = world.viewports[2];

        this._world.render(frame);
        this.paintRadarAngle();
        //return;

        if (this._balls.length === 0) return;

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
    }

    public stop() {
        this._settings.removeEventListener("change", this._boundHandleSettingsChanged);
    }
}   